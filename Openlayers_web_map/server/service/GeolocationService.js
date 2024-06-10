// saveGeoJSONToDatabase.js

const fs = require("fs");
const City = require("../model/City");
const path = require("path");
const axios = require("axios");

const geojsonFilePath = `${path.join(__dirname, "../data/map.geojson")}`;
const geojson = JSON.parse(fs.readFileSync(geojsonFilePath, "utf8"));

async function saveGeoJSONToDatabase() {
  try {
    for (const feature of geojson.features) {
      const { ID, Cityname, Cityimage, description } = feature.properties;
      const coordinates = feature.geometry.coordinates;
      console.log("🚀 ~ saveGeoJSONToDatabase ~ coordinates:", coordinates);

      const [exist, newModel] = await City.findOrCreate({
        where: {
          ID,
        },
        defaults: {
          ID,
          Cityname,
          Cityimage,
          location: { type: "Point", coordinates },
          description,
          // Không cập nhật total_click_count nếu dữ liệu đã tồn tại
          total_click_count: 0, // Giá trị mặc định là 0
        },
      });
      // Không cập nhật total_click_count nếu dữ liệu đã tồn tại
      // if (exist) {
      //   await exist.update({ total_click_count: 0 });
      // }
    }
    console.log("GeoJSON data has been saved to the database.");
  } catch (error) {
    console.error("Error saving GeoJSON data:", error);
  }
}

module.exports = saveGeoJSONToDatabase;
