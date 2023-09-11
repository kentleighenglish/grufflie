/*
 * MetadataFields Object
 */
"use strict";
var MetadataField = (function () {
    function MetadataField(id, name, type, item_type, label, empty, attributes) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.item_type = item_type;
        this.label = label;
        this.empty = empty;
        this.attributes = attributes;
    }
    return MetadataField;
}());
exports.MetadataField = MetadataField;
