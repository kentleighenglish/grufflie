"use strict";
var Relation = (function () {
    function Relation(relationId, relationCount, relationScore, item) {
        this.relationId = relationId;
        this.relationCount = relationCount;
        this.relationScore = relationScore;
        this.item = item;
    }
    return Relation;
}());
exports.Relation = Relation;
