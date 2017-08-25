import CloudFlareAPI from "cloudflare4";

function purgeCloudFlare({ config, site, files }) {
  var api = new CloudFlareAPI(config);

  api
    .zoneGetAll({
      name: site
    })
    .then(function(zones) {
      var zone = zones[0];

      api
        .zonePurgeCacheBy(zone.id, {
          files
        })
        .then(function(ok) {
          console.log("purged main.css and content");
        })
        .catch(function(err) {
          console.error(err);
        });
    })
    .catch(function(err) {
      console.error(err);
    });
}

export default purgeCloudFlare;
