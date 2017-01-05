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



import { jsonEditor } from "../../vendor/jquery.jsoneditor";
import { notify } from "../common/notify";
import { workflowApi } from "../common/api";
import { loading } from "../common/loading";
import * as startIOData from "./startIOData";
import { bipatiteView } from "../relation/bipatiteView";

var treeEdit_InputContainer;
var fromEdit_InputCodeContainer, fromEdit_InputTreeContainer, fromEdit_OutputCodeContainer, fromEdit_OutputTreeContainer;
var fromEdit_InputViewContainer;
var fromEdit_CodeEditor, fromEdit_TreeEditor, fromEdit_OutputCodeEditor, fromEdit_OutputTreeEditor;

export function initStartIO(start) {

    startIOData.getStartIOData(start);
    startIOData.setSelectedTab(0);
    showIOTabs();

    $("#newStartInput").on('click', function() {
        startIOData.optInput('add');
        startIOData.setSelectedTab(startIOData.data.length - 1);
        showInputTabs();
    });

    $("#deleteStartInput").on('click', function() {
        startIOData.optInput('delete');
        startIOData.setSelectedTab(0);
        showInputTabs();
    });
    $("#transform-tab").on("click", function() {
        showTransformationTab();
    })
    $("#input-type-event-select").on('change', function(event) {
        $("#removeLine").addClass("hide");
        var selectedType = $(event.currentTarget).val();
        var inputJson = startIOData.getInputJsonByType(selectedType).json;
        bipatiteView(inputJson, startIOData.getJson('output'), startIOData.transformationPluginData[selectedType]);
    })
    $("#resetRelation").on("click", function() {
        $("#removeLine").addClass("hide");
        var selectedType = $("#input-type-event-select").val();
        var inputJson = startIOData.getInputJsonByType(selectedType).json;
        startIOData.transformationPluginData[selectedType].relation = undefined;
        bipatiteView(inputJson, startIOData.getJson('output'), startIOData.transformationPluginData[selectedType]);
    })
}

function showIOTabs() {
    showInputTabs();
    showOutputTab();
    showTransformationTab();
}

function showInputTabs() {
    $("#startInputTabs").empty();
    $("#startInputTabsContent").empty();
    if (startIOData.data.length > 0) {
        let tabHTML = "";
        let tabContentHTML = "";
        let tabTemplate = _.template(
            `<li class="nav-item start-input-tab" data-index="<%= index %>">
            <a class="nav-link" href="#input-<%= index %>" data-toggle="tab">Input <%= index %></a>
        </li>`
        );
        let tabContentTemplate = _.template(
            `<div class="tab-pane" id="input-<%= index %>">
            <div class="input-type-event-div" data-index="<%= index %>">
                <div class="row col-md-6">
                    <label class="col-md-4 control-label">Select Type</label>
                    <div class="col-md-8">
                        <select class="input-type-select" style="width:100%">
                            <option value="github">Github</option>
                            <option value="gitlab">Gitlab</option>
                            <option value="customize">Customize</option>
                        </select>
                    </div>
                </div>
                <div class="row col-md-6 event-select-div">
                    <label class="col-md-4 control-label">Event</label>
                    <div class="col-md-8">
                        <select class="github-event-select" style="width:100%">
                            <option value="Create">Create</option>
                            <option value="Delete">Delete</option>
                            <option value="Deployment">Deployment</option>
                            <option value="DeploymentStatus">Deployment Status</option>
                            <option value="Fork">Fork</option>
                            <option value="Gollum">Gollum</option>
                            <option value="IssueComment">Issue Comment</option>
                            <option value="Issues">Issues</option>
                            <option value="Member">Member</option>
                            <option value="PageBuild">Page Build</option>
                            <option value="Public">Public</option>
                            <option value="PullRequestReviewComment">Pull Request Review Comment</option>
                            <option value="PullRequestReview">Pull Request Review</option>
                            <option value="PullRequest">Pull Request</option>
                            <option value="Push">Push</option>
                            <option value="Repository">Repository</option>
                            <option value="Release">Release</option>
                            <option value="Status">Status</option>
                            <option value="TeamAdd">Team Add</option>
                            <option value="Watch">Watch</option>
                        </select>
                        <select class="gitlab-event-select" style="width:100%">
                            <option value="Push Hook">Push</option>
                            <option value="Tag Push Hook">Tag Push</option>
                            <option value="Note Hook">Connents</option>
                            <option value="Issue Hook">Issues</option>
                            <option value="Merge Request Hook">Merge Request</option>
                        </select>
                    </div>
                </div>
                <div class="row col-md-6 event-input-div">
                    <label class="col-md-4 control-label">Event</label>
                    <div class="col-md-8">
                        <input type="text" class="form-control input-event-input" required>
                    </div>
                </div>
            </div>
            <div class="row col-md-12 input-json-div" data-index="<%= index %>">
                <div class="startInputTreeViewer"></div>
                <div class="startInputTreeDesigner">
                    <div class="row">
                        <div class="col-md-6 import-div">
                            <div class="panel">
                                <div class="panel-heading clearfix">
                                    <i class="glyphicon glyphicon-cloud-download outputicon"></i>
                                    <span class="panel-title">Input Tree Edit</span>
                                </div>
                                <div class="panel-body">
                                    <div class="inputTreeStart tree-add-button">
                                        <div class="inputStartBtn btn-div">
                                            <span class="glyphicon glyphicon-plus nohover"></span>
                                            <div class="desc">
                                                <label class="desc-label">Add New Value</label>
                                                <div class="desc-btn">
                                                    <span class="glyphicon glyphicon-plus"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="inputTreeDiv json-editor"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 import-div">
                            <div class="panel">
                                <div class="panel-heading clearfix">
                                    <i class="glyphicon glyphicon-cloud-download outputicon"></i>
                                    <span class="panel-title">Input From Edit</span>
                                </div>
                                <div class="panel-body">
                                    <div class="inputCodeEditor codeEditor"></div>
                                    <div class="col-md-4 col-md-offset-4 row editor-transfer">
                                        <span class="inputFromJson col-md-4 code-to-tree"></span>
                                        <span class="inputToJson col-md-4 tree-to-code"></span>
                                    </div>
                                    <div class="inputTreeEditor treeEditor"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        ); // template compile end

        _.each(startIOData.data, function(input, index) {
            tabHTML += tabTemplate({ 'index': index });
            tabContentHTML += tabContentTemplate({ 'index': index });
        });

        $("#startInputTabs").append(tabHTML);
        $("#startInputTabsContent").append(tabContentHTML);

        // event binding
        $(".start-input-tab").on('click', function(event) {
            var index = $(event.currentTarget).data("index");
            startIOData.setSelectedTab(index);
            initInputDiv();
        });

        $(".input-type-select").on("change", function() {
            startIOData.setTypeSelect();
            selectType(startIOData.getTypeSelect(), true);
        });

        $(".github-event-select").on("change", function() {
            startIOData.setEventSelect("github");
            getInputForEvent(startIOData.getTypeSelect(), startIOData.getEventSelect());
        });

        $(".gitlab-event-select").on("change", function() {
            startIOData.setEventSelect("gitlab");
            getInputForEvent(startIOData.getTypeSelect(), startIOData.getEventSelect());
        });

        $(".input-event-input").on("blur", function() {
            startIOData.setEventInput();
            if (!startIOData.isEventOptionAvailable()) {
                notify("There's a customize input for event '" + startIOData.getEventSelect() + "', please input another one.", "info");
                startIOData.setEvent("");
                startIOData.setEventInputDom();
            }
        });

        $(".inputStartBtn").on('click', function() {
            startIOData.setJson({
                "newKey": null
            });
            initTreeEdit();
            initFromEdit("input");
        });

        $(".inputFromJson").on('click', function() {
            fromCodeToTree("input");
        });

        $(".inputToJson").on('click', function() {
            fromTreeToCode("input");
        });

        // init trigger
        startIOData.findSelectedStartInputTabDom().find("a").addClass("active");
        startIOData.findSelectedStartInputTabContentDom().addClass("active");
        initInputDiv();
    }
}

function showOutputTab() {
    $("#outputStartBtn").on('click', function() {
        startIOData.setJson({
            "newKey": null
        }, 'output');
        initTreeEdit("output");
        initFromEdit("output");
    })
    $("#outputFromJson").on('click', function() {
        fromCodeToTree("output");
    });

    $("#outputToJson").on('click', function() {
        fromTreeToCode("output");
    });
    initTreeEdit("output");
    initFromEdit("output");
}

function showTransformationTab() {

    var inputTypes = startIOData.getInputTypeAndEventPairs();
    var option = _.template('<option value="<%= value %>"><%= value %></option>');
    var options = "";
    _.each(inputTypes, function(item) {
        options += option({ 'value': item });
    })
    var selectDOM = $("#input-type-event-select");
    selectDOM.empty();
    selectDOM.append(options);
    selectDOM.select2({ minimumResultsForSearch: Infinity });
    setRelationData();
    var inputJson = startIOData.getInputJsonByType(selectDOM.val()).json;
    setTimeout(function() {
        bipatiteView(inputJson, startIOData.getJson('output'), startIOData.transformationPluginData[selectDOM.val()]);
    }, 100)

}

function setRelationData() {
    var inputTypes = startIOData.getInputTypeAndEventPairs();
    _.each(inputTypes, function(item) {
        if (!startIOData.transformationPluginData[item]) {
            startIOData.transformationPluginData[item] = {};
        }
    })
}

function initInputDiv() {
    startIOData.setTypeSelectDom();
    selectType(startIOData.getTypeSelect());
}


function selectType(workflowType, isTypeChange) {
    let eventSelectDOM = startIOData.findEventSelectDivDom();
    let eventInputDOM = startIOData.findEventInputDivDom();
    let treeViewerDOM = startIOData.findInputTreeViewerDom();
    let treeDesignerDOM = startIOData.findInputTreeDesignerDom();
    let githubEventSelectDOM = startIOData.findGitHubEventSelectDom();
    let gitlabEventSelectDOM = startIOData.findGitLabEventSelectDom();

    if (isTypeChange) {
        startIOData.setJson({});
        startIOData.setEvent("");
    }

    if (workflowType == "github" || workflowType == "gitlab") {
        eventSelectDOM.show();
        eventInputDOM.hide();
        treeViewerDOM.show();
        treeDesignerDOM.hide();
        if (workflowType == "github") {
            githubEventSelectDOM.show();
            gitlabEventSelectDOM.hide();
            gitlabEventSelectDOM.next().hide();
        } else if (workflowType == "gitlab") {
            githubEventSelectDOM.hide();
            githubEventSelectDOM.next().hide();
            gitlabEventSelectDOM.show();
        }

        if (_.isEmpty(startIOData.getJson()) || isTypeChange) {
            if (_.isEmpty(startIOData.getEventSelect())) {
                if (workflowType == "github") {
                    startIOData.setEvent("PullRequest");
                } else if (workflowType == "gitlab") {
                    startIOData.setEvent("Push Hook");
                }

                startIOData.setEventSelectDom(workflowType);
            }
            getInputForEvent(startIOData.getTypeSelect(), startIOData.getEventSelect());
        } else {
            initFromView();
        }

        startIOData.setEventSelectDom(workflowType);
    } else {
        eventSelectDOM.hide();
        eventInputDOM.show();
        treeViewerDOM.hide();
        treeDesignerDOM.show();
        startIOData.setEventInputDom();

        initTreeEdit();
        initFromEdit("input");
    }
}

export function initTreeEdit(type) {
    if (type) {
        if (_.isUndefined(startIOData.getJson('output')) || _.isEmpty(startIOData.getJson('output'))) {
            $("#outputTreeStart").show();
            $("#outputTreeDiv").hide();

        } else {
            try {
                $("#outputTreeStart").hide();
                $("#outputTreeDiv").show();
                var treeEdit_OutputContainer = $("#outputTreeDiv");
                jsonEditor(treeEdit_OutputContainer, startIOData.getJson("output"), {
                    change: function(data) {
                        startIOData.setJson(data, "output");
                        initFromEdit("output");
                    }
                }, "start");
            } catch (e) {
                notify("Output Error in parsing json.", "error");
            }
        }
    } else {
        if (_.isUndefined(startIOData.getJson()) || _.isEmpty(startIOData.getJson())) {
            startIOData.findInputTreeStartDom().show();
            startIOData.findInputTreeDivDom().hide();
        } else {
            try {
                startIOData.findInputTreeStartDom().hide();
                startIOData.findInputTreeDivDom().show();

                treeEdit_InputContainer = startIOData.findInputTreeDivDom();
                jsonEditor(treeEdit_InputContainer, startIOData.getJson(), {
                    change: function(data) {
                        startIOData.setJson(data);
                        initFromEdit("input");
                    }
                }, "start");
            } catch (e) {
                notify("Input Error in parsing json.", "error");
            }
        }
    }

}

export function initFromEdit(type) {


    var codeOptions = {
        "mode": "code",
        "indentation": 2
    };

    var treeOptions = {
        "mode": "tree",
        "search": true
    };

    if (type == "input") {
        if (fromEdit_CodeEditor) {
            fromEdit_CodeEditor.destroy();
        }

        if (fromEdit_TreeEditor) {
            fromEdit_TreeEditor.destroy();
        }
        fromEdit_InputCodeContainer = startIOData.findInputCodeEditorDom()[0];
        fromEdit_CodeEditor = new JSONEditor(fromEdit_InputCodeContainer, codeOptions);

        fromEdit_InputTreeContainer = startIOData.findInputTreeEditorDom()[0];
        fromEdit_TreeEditor = new JSONEditor(fromEdit_InputTreeContainer, treeOptions);

        fromEdit_CodeEditor.set(startIOData.getJson());
        fromEdit_TreeEditor.set(startIOData.getJson());
        fromEdit_TreeEditor.expandAll();
    } else if (type == "output") {
        if (fromEdit_OutputCodeEditor) {
            fromEdit_OutputCodeEditor.destroy();
        }

        if (fromEdit_OutputTreeEditor) {
            fromEdit_OutputTreeEditor.destroy();
        }
        fromEdit_OutputCodeContainer = $("#outputCodeEditor")[0];
        fromEdit_OutputCodeEditor = new JSONEditor(fromEdit_OutputCodeContainer, codeOptions);

        fromEdit_OutputTreeContainer = $("#outputTreeEditor")[0];
        fromEdit_OutputTreeEditor = new JSONEditor(fromEdit_OutputTreeContainer, treeOptions);

        fromEdit_OutputCodeEditor.set(startIOData.getJson("output"));
        fromEdit_OutputTreeEditor.set(startIOData.getJson("output"));
        fromEdit_OutputTreeEditor.expandAll();
    }


}

function fromCodeToTree(type) {
    if (type == "input") {
        try {
            startIOData.setJson(fromEdit_CodeEditor.get());
            fromEdit_TreeEditor.set(startIOData.getJson());
            initTreeEdit();
        } catch (e) {
            notify("Input Code Changes Error in parsing json.", "error");
        }
        fromEdit_TreeEditor.expandAll();
    } else if (type == "output") {
        try {
            startIOData.setJson(fromEdit_OutputCodeEditor.get(), "output");
            fromEdit_OutputTreeEditor.set(startIOData.getJson("output"));
            initTreeEdit("output");
        } catch (e) {
            notify("Output Code Changes Error in parsing json.", "error");
        }
        fromEdit_OutputTreeEditor.expandAll();
    }


}

function fromTreeToCode(type) {
    if (type == "input") {
        try {
            startIOData.setJson(fromEdit_TreeEditor.get());
            fromEdit_CodeEditor.set(startIOData.getJson());
            initTreeEdit();
        } catch (e) {
            notify("Input Tree Changes Error in parsing json.", "error");
        }
    } else if (type == "output") {
        try {
            startIOData.setJson(fromEdit_OutputTreeEditor.get(), 'output');
            fromEdit_OutputCodeEditor.set(startIOData.getJson('output'));
            initTreeEdit('output');
        } catch (e) {
            notify("Output Tree Changes Error in parsing json.", "error");
        }
    }
}

function initFromView() {
    if (fromEdit_TreeEditor) {
        fromEdit_TreeEditor.destroy();
    }

    var treeOptions = {
        "mode": "view",
        "search": true
    };

    fromEdit_InputViewContainer = startIOData.findInputTreeViewerDom()[0];
    fromEdit_TreeEditor = new JSONEditor(fromEdit_InputViewContainer, treeOptions);
    fromEdit_TreeEditor.set(startIOData.getJson());

    fromEdit_TreeEditor.expandAll();
}

export function getInputForEvent(selectedType,selecetedEvent){
    if(startIOData.isEventOptionAvailable()){
        var promise = workflowApi.eventOutput(selectedType,selecetedEvent);
        promise.done(function(data){

            loading.hide();
            // startIOData.setJson(data.input);
            startIOData.setJson(data.output);
            initFromView();
        });
        promise.fail(function(xhr, status, error) {
            loading.hide();
            if (!_.isUndefined(xhr.responseJSON) && xhr.responseJSON.errMsg) {
                notify(xhr.responseJSON.errMsg, "error");
            } else if (xhr.statusText != "abort") {
                notify("Server is unreachable", "error");
            }
        });
    } else {
        if (fromEdit_TreeEditor) {
            fromEdit_TreeEditor.destroy();
        }
        startIOData.setJson({});
        notify("There's a " + startIOData.getTypeSelect() + " input for event '" + selecetedEvent + "', please select another one.", "info");
    }
}
