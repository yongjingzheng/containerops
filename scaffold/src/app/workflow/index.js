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

import { initWorkflowPage } from "./main";

var workflowNavTemplate = `<li>
			                    <a href="#" class="menu-workflow">
			                      <span class="icon">
			                        <i class="fa fa-desktop"></i>
			                      </span>
			                      Workflow
			                    </a>
		                   </li>
		                   `

$("#nav-ul").append(workflowNavTemplate);
// initWorkflowPage();

$(".menu-workflow").on('click',function(event){
    initWorkflowPage();
    $(event.currentTarget).parent().parent().children().removeClass("active");
    $(event.currentTarget).parent().addClass("active");
})
$( ".menu-workflow" ).trigger( "click" );
// $(".workflow-close-env").on('click', function() {
//     hideWorkflowEnv();
// });
