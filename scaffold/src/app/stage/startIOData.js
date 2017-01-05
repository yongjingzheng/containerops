/* 
Copyright 2014 Huawei Technologies Co., Ltd. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

export let data;
export let outputData;
export let transformationPluginData;

let selectedTab;
export function getStartIOData(start){
    // console.log("before")
    // console.log(start)
    // delete start.inputputJson;
    // delete start.plugins;
    // console.log("after")
    // console.log(start)
    if(start.inputJson == undefined){
        start.inputJson = [];
        start.inputJson.push($.extend(true,{},metadata));
    }
    if(start.outputJson == undefined){
        start.outputJson = {};
    }
    if(start.plugins == undefined){
        start.plugins = {};
        start.plugins = $.extend(true, {}, transformationPluginMetaData);
    }else if(start.plugins["transformation"] == undefined){
        start.plugins["transformation"] = {"data":{}};
    }
    data = start.inputJson;
    outputData = start.outputJson;
    transformationPluginData = start.plugins["transformation"].data;
}


// selectedTab
export function setSelectedTab(index){
    selectedTab = index;
}

// type select
export function findTypeSelectDom(){
    return $(".input-type-event-div[data-index="+ selectedTab +"]").find(".input-type-select");
}

export function setTypeSelect(){
    if(data[selectedTab] && findTypeSelectDom()){
        data[selectedTab].type = findTypeSelectDom().val();
    }
   
}

export function setTypeSelectDom(){
    if(data[selectedTab]){
         findTypeSelectDom().val(data[selectedTab].type);
         findTypeSelectDom().select2({
            minimumResultsForSearch: Infinity
         });
    }
   
}

export function getTypeSelect(){
    return data[selectedTab] ? data[selectedTab].type : "";
}

// event select
export function setEvent(e){
    data[selectedTab].event = e;
}

export function findGitHubEventSelectDom(){
    return $(".input-type-event-div[data-index="+ selectedTab +"]").find(".github-event-select");
}

export function findGitLabEventSelectDom(){
    return $(".input-type-event-div[data-index="+ selectedTab +"]").find(".gitlab-event-select");
}

export function findEventInputDom(){
    return $(".input-type-event-div[data-index="+ selectedTab +"]").find(".input-event-input");
}

export function setEventSelect(type){
    if(type == "github"){
        if(data[selectedTab]){
            data[selectedTab].event = findGitHubEventSelectDom().val();
        }
       
    }else if(type == "gitlab"){
        if(data[selectedTab]){
            data[selectedTab].event = findGitLabEventSelectDom().val();
        }
        
    }  
}

export function setEventInput(){
    if(data[selectedTab] && findEventInputDom()){
        data[selectedTab].event = findEventInputDom().val();
    }
    
}

export function setEventSelectDom(type){
    if(type == "github"){
        if(data[selectedTab]){
            findGitHubEventSelectDom().val(data[selectedTab].event);
            findGitHubEventSelectDom().select2({
              minimumResultsForSearch: Infinity
            });
        }
        
    }else if(type == "gitlab"){
        if(data[selectedTab]){
            findGitLabEventSelectDom().val(data[selectedTab].event);
            findGitLabEventSelectDom().select2({
                minimumResultsForSearch: Infinity
            });
        }
        
    }
}

export function setEventInputDom(){
    if(data[selectedTab]){
        findEventInputDom().val(data[selectedTab].event);
    }
} 

export function getEventSelect(){
    return data[selectedTab] ? data[selectedTab].event : "";
}

export function findEventSelectDivDom(){
    return $(".input-type-event-div[data-index="+ selectedTab +"]").find(".event-select-div");
}

export function findEventInputDivDom(){
    return $(".input-type-event-div[data-index="+ selectedTab +"]").find(".event-input-div");
}

// viewer
export function findInputTreeViewerDom(){
    return $(".input-json-div[data-index="+ selectedTab +"]").find(".startInputTreeViewer");
}

// designer
export function findInputTreeDesignerDom(){
    return $(".input-json-div[data-index="+ selectedTab +"]").find(".startInputTreeDesigner");
}

export function findInputTreeStartDom(){
  return $(".input-json-div[data-index="+ selectedTab +"]").find(".inputTreeStart");
}

export function findInputTreeDivDom(){
  return $(".input-json-div[data-index="+ selectedTab +"]").find(".inputTreeDiv");
}

export function findInputCodeEditorDom(){
  return $(".input-json-div[data-index="+ selectedTab +"]").find(".inputCodeEditor");
}

export function findInputTreeEditorDom(){
  return $(".input-json-div[data-index="+ selectedTab +"]").find(".inputTreeEditor");
}

// json
export function setJson(d, type){
    if(type){
        // outputData.json = d;
        outputData = d;
    }else {
        data[selectedTab].json = d;
    }
   
}

export function getJson(type){
    // for test
    // return type == "output" ? outputData[selectedTab].json : data[selectedTab].json;
    return type == "output" ? outputData : (data[selectedTab]?data[selectedTab].json:{});
    // return data[selectedTab].json;
}
export function getInputTypeAndEventPairs(){
    var inputTypes = _.map(data, function(item){
        return item.type + "_" + item.event;
    });
    return inputTypes || [];
}
export function getInputJsonByType(type){
    var inputData = _.find(data, function(item){
        return (item.type + "_" + item.event) == type;
    })
    return inputData || {};
}

// // new input
// export function addInput(){
//     data.push($.extend(true,{},metadata));
// }
// // delete Input
// export function deleteInput(){
//     data.splice(selectedTab,1);
// }
export function optInput(opt){
    if(opt==='add'){
        data.push($.extend(true,{},metadata));
    }else if(opt === 'delete'){
        data.splice(selectedTab,1);
    }
}
// tab
export function findSelectedStartInputTabDom(){
    return $(".start-input-tab[data-index="+ selectedTab +"]");
}

export function findSelectedStartInputTabContentDom(){
    return $(".input-type-event-div[data-index="+ selectedTab +"]").parent();
}

// check event options
export function isEventOptionAvailable(){
    var numbers = _.filter(data,function(item){
        return item.type == data[selectedTab].type && item.event == data[selectedTab].event;
    }).length;

    if(numbers == 1){
        return true;
    }

    return false;
}



var metadata = {
  "type" : "github",
  "event" : "PullRequest",
  "json" : {}
}
var transformationPluginMetaData = {
    "transformation":{
        "data":{}
    }
    
}



