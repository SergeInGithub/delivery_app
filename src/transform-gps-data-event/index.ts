// src/transform-gps-data-event/index.js
import { enrichGeodata } from './enrich-geodata'; // To enrich the GPS data

// Pusher Functions require an exports.handler declaration
exports.handler = async function (pusher: {
  data: any;
  ok: (arg0: string) => any;
  getConfig: (arg0: string) => any;
}) {
  const data = pusher.data; // the event data

  try {
    if (!data || !data.message.latitude || !data.message.longitude) {
      return pusher.ok(data); // don't process unexpected messages
    }

    const { latitude, longitude } = data.message;
    const POSITION_STACK_API_ACCESS_KEY = await pusher.getConfig(
      'POSITION_STACK_API_ACCESS_KEY',
    );
    const enrichedData = await enrichGeodata({
      latitude,
      longitude,
      accessKey: POSITION_STACK_API_ACCESS_KEY,
    });
    const currentTime = new Date().toLocaleTimeString();

    const transformedData = `
      <p>Your delivery is currently at ${enrichedData.street} in ${
      enrichedData.county
    }, ${enrichedData.region}, ${enrichedData.country}.</p>

      ${
        enrichedData.map_url
          ? `<p>View the map here: <a href="${enrichedData.map_url}">${enrichedData.label}</a></p>`
          : ''
      }

      <p>Last updated at ${currentTime}</p>
    `;

    return pusher.ok(transformedData);
  } catch (error) {
    return pusher.ok(data);
  }
};
