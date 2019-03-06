function createAttribute(label, val){
    return {
        "label" : label,
        "value": val //Array
    }
}

function updateLabel(oldLabel, newLabel){
    var shape = findInArray(labellingData[ imgSelected.name ].shapes, "label", oldLabel);
    shape.label = newLabel;
}

function updateFeaturePointInStore(shapeId, pointid, position, newLabel){
    var shape = getShape(shapeId);
    var scale = 1 / imgSelected.size.imageScale;
    var featurePoints = shape.featurePoints;
    var index = indexOf(featurePoints, "id", pointid);

    if(position){
        featurePoints[index].x = position.cx * scale;
        featurePoints[index].y = position.cy * scale;
    }

    if(newLabel){
        featurePoints[index].label = newLabel
    }
}

function getShape(shapeId){
    return findInArray(labellingData[ imgSelected.name ].shapes, "id", shapeId);
}

function attachPointToShape(shapeId, pointid, position){
    var shape = getShape(shapeId);
    var scale = 1 / imgSelected.size.imageScale;
    shape.featurePoints.push( {
        "x": position.cx * scale,
        "y": position.cy * scale,
        "label" : shape.featurePoints.length,
        "id" : pointid
    });
}

function detachShape(shapeId){
    var shapes = labellingData[ imgSelected.name ].shapes;
    var index = indexOf(shapes, "id", shapeId);
    shapes.splice(index,1);
}

function detachPoint(shapeId, pointid){
    var shape = getShape(shapeId);
    var featurePoints = shape.featurePoints;
    var index = indexOf(featurePoints, "id", pointid);
    featurePoints.splice(index, 1);
}

function detachPointByIndex(shapeId, pointIndex){
    var shape = getShape(shapeId);
    var featurePoints = shape.featurePoints;
    featurePoints.splice(pointIndex, 1);
}

/**
 * Scales the shape data based on scale
 * @param {string} id - id of shape
 * @param {string} label - label of shape
 * @param {Object} bbox - rbox of shape
 * @param {points[]} points - points that form the shape, e.g. 4 points of a rect
 * @param {number} scale - scale used to rescale shape
 * @returns {Object} scaled shape data
 */
function scaleShape(id, type, bbox, points, scale) {
    return {
        "id" : id,
        "label" : "unlabelled",
        "type" : type,
        "points": scaleShapePoints(points, scale, type),
        "bbox" : scaleBbox(bbox, scale) || {
            "x": 0,
            "y": 0,
            "w": 0,
            "h": 0        },
        "attributes": [],
        "tags": [],
        "featurePoints": [],
        "zoomScale" : 1,
        "defaultZoomScale": 1/imgSelected.size.imageScale
    }
}

/**
 * Scales the points of the shape according to scale and type
 * @param {points[] | Array[points[]]} point
 * @param {number} scale
 * @param {string} type - type of shape
 * @returns {points[] | Array[points[]]} scaled points
 */
function scaleShapePoints(points, scale, type) {
    if (!points) return;

    if (type == "polygon") {
      return points.map(point => {
        return point.map(val => val * scale);
      });
    }
    // Return this for other shapes
    return points.map(point => point * scale);
}

/**
 * Scales the rbox of shape according to scale
 * @param {Object} bbox - rbox of shape
 * @param {number} scale
 * @returns {Object} scaled rbox
 */
function scaleBbox(bbox, scale) {
    return {
        'x': bbox.x * scale,
        'y': bbox.y * scale,
        'cx': (bbox.cx || 0) * scale,
        'cy': (bbox.cy || 0) * scale,
        'w': bbox.w * scale,
        'h': bbox.h * scale,
        'width': bbox.w * scale,
        'height': bbox.h * scale
    }
}

/**
 * Scales the feature points according to scale
 * @param {featurePoints[]} featurePoints - array of featurePoints
 * @param {number} scale
 * @returns {featurePoints[]} scaled featurePoints
 */
function scaleFeaturePoints(featurePoints, scale) {
    if (!featurePoints) return;

    return featurePoints.map(point => {
        return {
          "x": point.x * scale,
          "y": point.y * scale,
          "label" : point.label,
          "id" : point.id
        };
    });
}

function updateShapeDetailInStore(shapeId, bbox, points){
    var shapes = labellingData[ imgSelected.name ].shapes;
    var shape = getShape(shapeId);
    var index = indexOf(shapes, "id", shapeId);
    var scale = 1 / imgSelected.size.imageScale;
    bbox && (shapes[index].bbox = scaleBbox(bbox, scale));
    points && (shapes[index].points = scaleShapePoints(points, scale, shape.type));
}

/**
 * Adds a shape into labelling data and returns a shape object
 */
function attachShapeToImg(id, type, bbox, points){
    var shape = scaleShape(id, type, bbox, points, 1 / imgSelected.size.imageScale);
    labellingData[ imgSelected.name ].shapes.push(shape);
    return shape;
}

function addImgToStore(imgname, size) {
    // If we already have this image data in localstorage,
    // don't initialize its properties
    if(!labellingData[imgname]){
        labellingData[imgname] = {
            //"path" : "",
            "imagename": imgname,
            "attributes": [],
            "tags": [],
            "size" : {
                "width": size.width,
                "height": size.height
            },
            "shapes": [],
            "shapeIndex": 0,   // Used to generate new ids for copy pasted shapes
            "pointIndex": 0,    // Used to generate new ids for feature points
            "featurePointSize": 3 // Stores featurePointSize per image
        }
    }
}

var labellingData = {};
// circle: schema.data[n].shapes[n].points = [cx, cy, r]
// eclipse: schema.data[n].shapes[n].points = [cx, cy, rx, ry]
// line: schema.data[n].shapes[n].points = [x1, y1, x2, y2]
// rectangle: schema.data[n].shapes[n].points = [x, y, w, h]
// polygon: schema.data[n].shapes[n].points = [x1, y1, x2, y2, ...]
// path: schema.data[n].shapes[n].path = ""



var landmarksArray = [
    {
        id: 0,
        text: 'jaw_line_1'
    },
    {
        id: 1,
        text: 'jaw_line_2'
    },
    {
        id: 2,
        text: 'jaw_line_3'
    },
    {
        id: 3,
        text: 'jaw_line_4'
    },
    {
        id: 4,
        text: 'jaw_line_5'
    },
    {
        id: 5,
        text: 'jaw_line_6'
    },
    {
        id: 6,
        text: 'jaw_line_7'
    },
    {
        id: 7,
        text: 'jaw_line_8'
    },
    {
        id: 8,
        text: 'jaw_line_9'
    },
    {
        id: 9,
        text: 'jaw_line_10'
    },
    {
        id: 10,
        text: 'jaw_line_11'
    },
    {
        id: 11,
        text: 'jaw_line_12'
    },
    {
        id: 12,
        text: 'jaw_line_13'
    },
    {
        id: 13,
        text: 'jaw_line_14'
    },
    {
        id: 14,
        text: 'jaw_line_15'
    },
    {
        id: 15,
        text: 'jaw_line_16'
    },
    {
        id: 16,
        text: 'jaw_line_17'
    },
    {
        id: 17,
        text: 'left_eye_brow_18'
    },
    {
        id: 18,
        text: 'left_eye_brow_19'
    },
    {
        id: 19,
        text: 'left_eye_brow_20'
    },
    {
        id: 20,
        text: 'left_eye_brow_21'
    },
    {
        id: 21,
        text: 'left_eye_brow_22'
    },
    {
        id: 22,
        text: 'right_eye_brow_23'
    },
    {
        id: 23,
        text: 'right_eye_brow_24'
    },
    {
        id: 24,
        text: 'right_eye_brow_25'
    },
    {
        id: 25,
        text: 'right_eye_brow_26'
    },
    {
        id: 26,
        text: 'right_eye_brow_27'
    },
    {
        id: 27,
        text: 'nose_28'
    },
    {
        id: 28,
        text: 'nose_29'
    },
    {
        id: 29,
        text: 'nose_30'
    },
    {
        id: 30,
        text: 'nose_31'
    },
    {
        id: 31,
        text: 'nose_32'
    },
    {
        id: 32,
        text: 'nose_33'
    },
    {
        id: 33,
        text: 'nose_34'
    },
    {
        id: 34,
        text: 'nose_35'
    },
    {
        id: 35,
        text: 'nose_36'
    },
    {
        id: 36,
        text: 'left_eye_37'
    },
    {
        id: 37,
        text: 'left_eye_38'
    },
    {
        id: 38,
        text: 'left_eye_39'
    },
    {
        id: 39,
        text: 'left_eye_40'
    },
    {
        id: 40,
        text: 'left_eye_41'
    },
    {
        id: 41,
        text: 'left_eye_42'
    },
    {
        id: 42,
        text: 'right_eye_43'
    },
    {
        id: 43,
        text: 'right_eye_44'
    },
    {
        id: 44,
        text: 'right_eye_45'
    },
    {
        id: 45,
        text: 'right_eye_46'
    },
    {
        id: 46,
        text: 'right_eye_47'
    },
    {
        id: 47,
        text: 'right_eye_48'
    },
    {
        id: 48,
        text: 'mouth_49'
    },
    {
        id: 49,
        text: 'mouth_50'
    },
    {
        id: 50,
        text: 'mouth_51'
    },
    {
        id: 51,
        text: 'mouth_52'
    },
    {
        id: 52,
        text: 'mouth_53'
    },
    {
        id: 53,
        text: 'mouth_54'
    },
    {
        id: 54,
        text: 'mouth_55'
    },
    {
        id: 55,
        text: 'mouth_56'
    },
    {
        id: 56,
        text: 'mouth_57'
    },
    {
        id: 57,
        text: 'mouth_58'
    },
    {
        id: 58,
        text: 'mouth_59'
    },
    {
        id: 59,
        text: 'mouth_60'
    },
    {
        id: 60,
        text: 'mouth_61'
    },
    {
        id: 61,
        text: 'mouth_62'
    },
    {
        id: 62,
        text: 'mouth_63'
    },
    {
        id: 63,
        text: 'mouth_64'
    },
    {
        id: 64,
        text: 'mouth_65'
    },
    {
        id: 65,
        text: 'mouth_66'
    },
    {
        id: 66,
        text: 'mouth_67'
    },
    {
        id: 67,
        text: 'mouth_68'
    }
];

var fileArray = [];