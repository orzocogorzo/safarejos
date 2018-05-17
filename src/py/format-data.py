import json
import os
from osgeo import ogr

data = dict()
files = os.listdir('./data')

parceles = json.load(open('parceles.json'))

for f in parceles["features"]:
  f["wkb_geom"] = ogr.CreateGeometryFromJson(json.dumps(f["geometry"]))

for file in files:
  data[file] = json.load(open(file));

dimensions = data[files[0]].keys()

layers = { dimension: None for dimension of dimensions }

for f, d in data.items():
  wkb_point = ogr.Geometry(ogr.wkbPoint)
  wkb_point.AddPoint( data[f]["home"]["lng"], data[f]["home"]["lat"] )
  for parcela in parceles:
    print wkb_point.Within(parcela["wkb_geom"])  
  
