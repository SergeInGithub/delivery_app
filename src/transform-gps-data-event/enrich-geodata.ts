const http = require('http');

type RequestParams = {
  method: string;
  path: string;
  params: any;
  accessKey: string;
};

type GeodataParams = {
  latitude: number;
  longitude: number;
  accessKey: string;
};

const makeRequest = async ({
  method,
  path,
  params,
  accessKey,
}: RequestParams) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: 'api.positionstack.com',
        port: 80,
        method,
        path: `${path}?access_key=${accessKey}&query=${params.query}&limit=1`,
      },
      (res: { on: (arg0: string, arg1: { (chunk: any): void }) => void }) => {
        let data = '';

        res.on('data', (chunk: string) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      },
    );

    req.on('error', (error: any) => {
      reject(error);
    });

    req.end();
  });
};

export const enrichGeodata = async ({
  latitude,
  longitude,
  accessKey,
}: GeodataParams) => {
  if (!latitude || !longitude) {
    throw new Error('Missing latitude and/or longitude');
  }

  const response = await makeRequest({
    path: '/v1/reverse',
    method: 'GET',
    params: {
      query: `${latitude},${longitude}`,
    },
    accessKey,
  });

  const enrichedData = (response as { data: any }).data;

  return enrichedData[0];
};
