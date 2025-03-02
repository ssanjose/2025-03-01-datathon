import Image from "next/image";
import VoronoiMap from "../components/VoronoiMap";
// You'll need to fetch or import the Winnipeg GeoJSON data
import { FeatureCollection, Geometry } from "geojson";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';


// import csv data from data/fire_station_location_winnipeg.csv
const csvFilePath = path.join(process.cwd(), 'data/fire_station_location_winnipeg.csv');

const fireStations: { longitude: number, latitude: number, name: string }[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    fireStations.push({
      longitude: parseFloat(row.Longitude),
      latitude: parseFloat(row.Latitude),
      name: row.Station_Location
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });


const winnipegGeoJson: FeatureCollection<Geometry> = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [[
          [
            [-97.325875, 49.766204],
            [-97.325875, 49.99275],
            [-96.953987, 49.99275],
            [-96.953987, 49.766204],
            [-97.325875, 49.766204]
          ]
        ]]
      },
      "properties": {
        "name": "Winnipeg"
      }
    }
  ]
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <VoronoiMap
          data={fireStations}
          winnipegGeoJson={winnipegGeoJson}
        />
      </main>
    </div>
  );
}