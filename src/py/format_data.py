import json
import os

data = list()
jsonDump = open('data/responses.json')

for line in jsonDump.readlines():
  data.append(json.loads(line))

dimensions = data[0].keys()

layers = { dimension: { "type": "FeatureCollection", "features": [] } for dimension in dimensions }

index = 0
for d in data:
  for dim in d.keys():
    if dim in layers.keys():
      if type(d[dim]) == dict and "features" in d[dim].keys() and d[dim]["type"] == "FeatureCollection":
        for feature in d[dim]["features"]:
          feature["properties"] = feature["properties"] or dict()
          feature["properties"].update(dict(
            gender=d["personal"]["gender"],
            age=d["personal"]["age"],
            id=index,
            social_status=d["personal"]["social_status"],
            home=[ d["home"]["lng"], d["home"]["lat"] ]
          ))
          layers[dim]["features"].append(feature)
      elif type(d[dim]) == list:
        personalData = dict(
          gender=d["personal"]["gender"],
          age=d["personal"]["age"],
          social_status=d["personal"]["social_status"],
          id=index
        )
        new_features = []
        for item in d[dim]:
          personalData.update({
            "x_start":  d["home"]["lng"],
            "y_start": d["home"]["lat"],
            "id_start": index,
            "x_end": item["lng"],
            "y_end": item["lat"],
            "id_end": item["geom_id"]
          })

          new_features.append({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                d["home"]["lng"], d["home"]["lat"]
              ]
            },
            "properties": personalData
          })

        layers[dim]["features"] = layers[dim]["features"] + new_features
      elspe:
        personalData = dict(
          gender=d["personal"]["gender"],
          age=d["personal"]["age"],
          social_status=d["personal"]["social_status"],
          id=index
        ).update(d[dim])
        
        newFeature = {
          "type": "Feature",
          "properties": personalData,
          "geometry": {
            "type": "Point",
            "coordinates": [ d["home"]["lng"], d["home"]["lat"] ]
          }
        }
        layers[dim]["features"].append(newFeature)

  index += 1

for layer in layers:
  open( os.path.join('result', (layer + '.json')), 'w').write(json.dumps(layers[layer]))
  