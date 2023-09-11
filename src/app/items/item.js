"use strict";
var Item = (function () {
    function Item(id, name, type, parent, metadata, tags, relations) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.parent = parent;
        this.metadata = metadata;
        this.tags = tags;
        this.relations = relations;
    }
    return Item;
}());
exports.Item = Item;
