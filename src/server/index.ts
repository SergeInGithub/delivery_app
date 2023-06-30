import Pusher from 'pusher';
import * as LOCATIONS from '../data';
import dotenv from 'dotenv';

dotenv.config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string, // Add your app id
  key: process.env.PUSHER_APP_KEY as string, // Add your API key
  secret: process.env.PUSHER_APP_SECRET as string, // Add your API secret
  cluster: process.env.PUSHER_APP_CLUSTER as string, // Add your cluster
  useTLS: true,
});

pusher.trigger('delivery-channel', 'location-update-event', {
  message: LOCATIONS.LOCATION_KIGALI_HEIGHTS_JAVA_HOUSE, // You can use any of the three locations
});
