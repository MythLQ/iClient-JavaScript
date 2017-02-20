﻿/* COPYRIGHT 2017 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * Class: SuperMap.REST.FindMTSPPathsService
 * 多旅行商分析服务类
 * 多旅行商分析也称为物流配送，是指在网络数据集中，给定 M 个配送中心点和 N 个配送目的地（M，N 为大于零的整数）。
 * 查找经济有效的配送路径，并给出相应的行走路线。
 * 物流配送功能就是解决如何合理分配配送次序和送货路线，使配送总花费达到最小或每个配送中心的花费达到最小。
 * 该类负责将客户端指定的多旅行商分析参数传递给服务端，并接收服务端返回的结果数据。
 * 多旅行商分析结果通过该类支持的事件的监听函数参数获取
 * Inherits from:
 *  - <SuperMap.CoreServiceBase>
 */
require('./CoreServiceBase');

SuperMap.REST.FindMTSPPathsService = SuperMap.Class(SuperMap.CoreServiceBase, {

    /**
     * Constructor: SuperMap.REST.FindMTSPPathsService
     * 最佳路径分析服务类构造函数。
     *
     * 例如：
     * (start code)
     * var myFindMTSPPathsService = new SuperMap.REST.FindMTSPPathsService(url, {
     *     eventListeners: {
     *         "processCompleted": findMTSPPathsCompleted, 
     *		   "processFailed": findMTSPPathsError
     *		   }
     * });
     * (end)       
     *
     * Parameters:
     * url - {String} 网络分析服务地址。请求网络分析服务，URL应为：
     * http://{服务器地址}:{服务端口号}/iserver/services/{网络分析服务名}/rest/networkanalyst/{网络数据集@数据源}；
     * 例如:"http://localhost:8090/iserver/services/components-rest/rest/networkanalyst/RoadNet@Changchun"。
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     */
    initialize: function (url, options) {
        SuperMap.CoreServiceBase.prototype.initialize.apply(this, arguments);
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function () {
        SuperMap.CoreServiceBase.prototype.destroy.apply(this, arguments);
    },

    /**
     * APIMethod: processAsync
     * 负责将客户端的查询参数传递到服务端。
     *
     * Parameters:
     * params - {<SuperMap.REST.FindMTSPPathsParameters>} 
     */
    processAsync: function (params) {
        if (!params) {
            return;
        }
        var me = this, jsonObject,
            end = me.url.substr(me.url.length - 1, 1),
            centers = me.getJson(params.isAnalyzeById, params.centers),
            nodes = me.getJson(params.isAnalyzeById, params.nodes);
        me.url = me.url + "/mtsppath" + (this.isInTheSameDomain ? ".json?" : ".jsonp?");       
        jsonObject = {
            centers: centers,
            nodes: nodes,
            parameter: SuperMap.Util.toJSON(params.parameter),
            hasLeastTotalCost: params.hasLeastTotalCost
        };
        me.request({
            method: "GET",
            params: jsonObject,
            scope: me,
            success: me.serviceProcessCompleted,
            failure: me.serviceProcessFailed
        });
    },

    /**
     * Method: getJson
     * 将对象转化为JSON字符串。
     *
     * Parameters:
     * isAnalyzeById - {Boolean}
     * params - {Array} 
     *
     * Returns:
     * {Object} 转化后的JSON字符串。
     */
    getJson: function (isAnalyzeById, params) {
        var jsonString = "[",
            len = params ? params.length : 0;
        
        if (isAnalyzeById === false) {
            for (var i = 0; i < len; i++) {
                if (i > 0) jsonString += ",";
                jsonString += '{"x":' + params[i].x + ',"y":' + params[i].y + '}';
            }            
        } else if (isAnalyzeById == true) {
            for (var i = 0; i < len; i++) {
                if (i > 0) jsonString += ",";
                jsonString += params[i];
            }
        }        
        jsonString += ']';
        return jsonString;
    },

    CLASS_NAME: "SuperMap.REST.FindMTSPPathsService"
});

module.exports = function (url, options) {
    return new SuperMap.REST.FindMTSPPathsService(url, options);
};