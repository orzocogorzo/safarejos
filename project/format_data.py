import json
import os
# from osgeo import ogr

data = dict()
files = os.listdir('./data')

# parceles = json.load(open('parceles_25231.json'))

# for f in parceles["features"]:
#   f["wkb_geom"] = ogr.CreateGeometryFromJson(json.dumps(f["geometry"]))

for file in files:
  data[file] = json.load(open(os.path.join('data',file)))

dimensions = data[files[0]].keys()

layers = { dimension: { "type": "FeatureCollection", "features": [] } for dimension in dimensions }

for d in data.values():
  for dim in d.keys():
    if dim in layers.keys():
      if type(d[dim]) == dict and "features" in d[dim].keys() and d[dim]["type"] == "FeatureCollection":
        for feature in d[dim]["features"]:
          feature["properties"] = feature["properties"] or dict()
          feature["properties"].update(dict(
            gender=d["personal"]["gender"],
            age=d["personal"]["age"],
            social_status=d["personal"]["social_status"],
            home=[ d["home"]["lng"], d["home"]["lat"] ]
          ))
          layers[dim]["features"].append(feature)
      else:
        if type(d[dim]) != dict:
          d[dim] = {"selection": d[dim]}

        personalData = dict(
          gender=d["personal"]["gender"],
          age=d["personal"]["age"],
          social_status=d["personal"]["social_status"]
        )
        personalData.update(d[dim])
        newFeature = {
          "type": "Feature",
          "properties": personalData,
          "geometry": {
            "type": "Point",
            "coordinates": [ d["home"]["lng"], d["home"]["lat"] ]
          }
        }
        layers[dim]["features"].append(newFeature)

for layer in layers:
  open( os.path.join('result', (layer + '.json')), 'w').write(json.dumps(layers[layer]))

  # wkb_point = ogr.Geometry(ogr.wkbPoint)
  # wkb_point.AddPoint( data[f]["home"]["lng"], data[f]["home"]["lat"] )
  # for parcela in parceles["features"]:
  #   print wkb_point.Within(parcela["wkb_geom"])  
  
