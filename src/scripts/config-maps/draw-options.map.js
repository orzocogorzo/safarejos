export default {
  barriers: {
    tools: {
      "1": [ "brush", "line", "polygon" ],
      "2": [ "brush", "line", "polygon" ],
      "3": [ "brush", "line", "polygon" ],
      "4": [ "brush", "line", "polygon" ]
    },
    properties: [ 
      {
        name: "description",
        type: "text"
      }
    ]
  },
  paths: {
    tools: {
      "1": [ "line", "form" ]
    },
    properties: [
      {
        name: "mode",
        type: "select",
        options: [ "car", "motorcycle", "public-transport", "walking", "cycling", "others" ]
      },{
        name: "reason",
        type: "text"
      }
    ]
  }
}