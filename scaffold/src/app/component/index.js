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

import { initComponentPage } from "./main";

var componentNavTemplate = `<li>
				                <a href="#" class="menu-component">
				                    <span class="icon">
				                        <i class="fa fa-cube"></i>
				                    </span>
				                    Component
				                </a>
				           </li>
		                   `

$("#nav-ul").append(componentNavTemplate);
$(".menu-component").on('click', function(event) {
    initComponentPage();
    $(event.currentTarget).parent().parent().children().removeClass("active");
    $(event.currentTarget).parent().addClass("active");
})
// $( ".menu-component" ).trigger( "click" );
