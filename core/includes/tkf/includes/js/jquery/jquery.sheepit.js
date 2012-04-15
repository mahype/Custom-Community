(function($){jQuery.fn.sheepIt=function(options){function cloneTemplate()
{var clone;if(typeof options.beforeClone==="function"){options.beforeClone(source,template);}
clone=template.cloneWithAttribut(true);if(typeof options.afterClone==="function"){options.afterClone(source,clone);}
clone.getSource=function(){return source;};return clone;}
function clickOnAdd(event)
{event.preventDefault();addForm();}
function clickOnAddN(event)
{event.preventDefault();if(addNInput.value!==''){addNForms(addNInput.attr('value'));}}
function clickOnRemoveCurrent(event)
{event.preventDefault();if(options.removeCurrentConfirmation){if(confirm(options.removeCurrentConfirmationMsg)){removeCurrentForm($(this).data('removableClone'));}}else{removeCurrentForm($(this).data('removableClone'));}}
function clickOnRemoveLast(event)
{event.preventDefault();if(options.removeLastConfirmation){if(confirm(options.removeLastConfirmationMsg)){removeLastForm();}}else{removeLastForm();}}
function clickOnRemoveAll(event)
{event.preventDefault();if(options.removeAllConfirmation){if(confirm(options.removeAllConfirmationMsg)){removeAllForms();}}else{removeAllForms();}}
function normalizeFieldsForForm(form,index)
{form.find(formFields).each(function(){var that=$(this),idAttr=that.attr("id"),nameAttr=that.attr("name");newNameAttr=nameAttr.replace(options.indexFormat,index);that.attr("name",newNameAttr);newIdAttr=idAttr.replace(options.indexFormat,index);form.find("label[for='"+idAttr+"']").each(function(){$(this).attr("for",newIdAttr);});that.attr("id",newIdAttr);});}
function normalizeLabelsForForm(form,index)
{setLabelForForm(form,index+1);}
function setLabelForForm(form,label)
{form.find(options.labelSelector).html(label);return true;}
function getLabelForForm(form)
{return form.find(options.labelSelector).html();}
function normalizeControls()
{if(hasForms()){if(getFormsCount()==1){removeAll.hideIf();removeLast.showIf();}else{removeAll.showIf();removeLast.showIf();}
var removeCurrents='';if(options.allowRemoveCurrent){removeCurrents=source.find(options.removeCurrentSelector);if(canRemoveForm()){removeCurrents.show();}else{removeCurrents.hide();}}else{removeCurrents=source.find(options.removeCurrentSelector);removeCurrents.hide();}}else{removeLast.hideIf();removeAll.hideIf();}
if(!canAddForm()){add.hideIf();addN.hideIf();}else{add.showIf();addN.showIf();}
if(!canRemoveForm()){removeLast.hideIf();removeAll.hideIf();}
if(add.css('display')!='none'||addN.css('display')!='none'||removeAll.css('display')!='none'||removeLast.css('display')!='none'){controls.show();}else{controls.hide();}}
function normalizeForms()
{(hasForms())?noFormsTemplate.hide():noFormsTemplate.show();}
function normalizeForm(form)
{if(form.attr("id")){form.attr("id",template.attr("id")+getIndex());}
normalizeFieldsForForm(form,getIndex());normalizeLabelsForForm(form,getIndex());if(form.html().indexOf(options.indexFormat)!=-1){var re=new RegExp(options.indexFormat,"ig");form.html(form.html().replace(re,getIndex()));}
var removeCurrent=form.find(options.removeCurrentSelector);(options.allowRemoveCurrent)?removeCurrent.show():removeCurrent.hide();return form;}
function normalizeAll()
{normalizeForms();normalizeControls();}
function addForm(normalize,form)
{if(typeof normalize=='undefined'){normalize=true;}
if(typeof form=='undefined'){form=false;}
if(typeof options.beforeAdd==="function"){options.beforeAdd(source);}
var newForm=false;if(form){if(typeof(form)=='string'){newForm=$('#'+form);}
else if(typeof(form)=='object'){newForm=form;}else{return false;}
newForm.remove();}
else{newForm=cloneTemplate();}
if(canAddForm()&&newForm){newForm=normalizeForm(newForm);var removeCurrentBtn=newForm.find(options.removeCurrentSelector).first();removeCurrentBtn.click(clickOnRemoveCurrent);removeCurrentBtn.data('removableClone',newForm);newForm.data('formIndex',getIndex());newForm.data('previousSeparator',false);newForm.data('nextSeparator',false);newForm.data('previousForm',false);newForm.data('nextForm',false);if(hasForms()){var lastForm=getLastForm();lastForm.data('nextForm',newForm);newForm.data('previousForm',lastForm);if(options.separator){var separator=getSeparator();separator.insertAfter(lastForm);lastForm.data('nextSeparator',separator);newForm.data('previousSeparator',separator);}}
(options.insertNewForms=='after')?newForm.insertBefore(noFormsTemplate):newForm.insertAfter(noFormsTemplate);if(options.nestedForms.length>0){var x=0;var nestedForms=[];for(x in options.nestedForms){if(typeof(options.nestedForms[x].id)!='undefined'&&typeof(options.nestedForms[x].options)!='undefined'){options.nestedForms[x].isNestedForm=true;options.nestedForms[x].parentForm=source;var id=options.nestedForms[x].id.replace(options.indexFormat,newForm.data('formIndex'));var nestedForm=$('#'+id).sheepIt(options.nestedForms[x].options);nestedForms.push(nestedForm);}}
newForm.data('nestedForms',nestedForms);}
extendForm(newForm);forms.push(newForm);if(normalize){normalizeAll();}
if(typeof options.afterAdd==="function"){options.afterAdd(source,newForm);}
return true;}else{return false;}}
function addNForms(n,normalize)
{if(typeof n!='undefined'){n=parseFloat(n);var x=1;for(x=1;x<=n;x++){addForm(normalize);}}}
function removeLastForm(normalize)
{if(typeof normalize=='undefined'){normalize=true;}
if(canRemoveForm()){removeForm();if(normalize){normalizeAll();}
return true;}else{return false;}}
function removeAllForms(normalize)
{if(typeof normalize=='undefined'){normalize=true;}
if(canRemoveAllForms()){var x=[];for(x in forms){if(forms[x]){removeForm(forms[x]);}}
if(normalize){normalizeAll();}
return true;}else{return false;}}
function removeCurrentForm(formToRemove,normalize)
{if(typeof normalize=='undefined'){normalize=true;}
if(canRemoveForm()){removeForm(formToRemove);if(normalize){normalizeAll();}
return true;}else{return false;}}
function removeForm(formToRemove)
{if(typeof formToRemove=='undefined'){formToRemove=getLastForm();}
index=formToRemove.data('formIndex');if(formToRemove.data('previousSeparator')&&formToRemove.data('nextSeparator')){formToRemove.data('previousSeparator').remove();formToRemove.data('previousForm').data('nextSeparator',formToRemove.data('nextSeparator'));}
else if(formToRemove.data('previousSeparator')&&!formToRemove.data('nextSeparator')){formToRemove.data('previousSeparator').remove();formToRemove.data('previousForm').data('nextSeparator',false);}
else if(!formToRemove.data('previousSeparator')&&formToRemove.data('nextSeparator')){formToRemove.data('nextSeparator').remove();formToRemove.data('nextForm').data('previousSeparator',false);}
if(formToRemove.data('previousForm')){formToRemove.data('previousForm').data('nextForm',formToRemove.data('nextForm'));}
if(formToRemove.data('nextForm')){formToRemove.data('nextForm').data('previousForm',formToRemove.data('previousForm'));}
forms[index]=false;formToRemove.remove();return true;}
function current()
{return ip;}
function next()
{if(ip!==false){if(forms.length>1){var i=0;var init=parseFloat(ip+1);for(i=init;i<forms.length;i++){if(forms[i]){ip=i;return true;}}
return false;}else{return false;}}else{return false;}}
function previous()
{if(ip!==false){if(forms.length>1){var i=0;var init=parseFloat(ip-1);for(i=init;i>=0;i--){if(forms[i]){ip=i;return true;}}
return false;}else{return false;}}else{return false;}}
function first()
{ip=false;if(forms.length>0){var x=0;for(x in forms){if(forms[x]){ip=x;return true;}}
return false;}else{return false;}}
function last()
{ip=false;if(forms.length>0){if(forms[forms.length-1]){ip=forms.length-1;return true;}else{var i=0;for(i=(forms.length-1);i>=0;i--){if(forms[i]){ip=i;return true;}}
return false;}}else{return false;}}
function count()
{if(forms.length>0){var count=0;var x=[];for(x in forms){if(forms[x]){count++;}}
return count;}else{return 0;}}
function setPointerTo(position)
{if(typeof position!='undefined'){ip=getIndexForPosition(position);if(ip!==false){return true;}else{return false;}}else{return false;}}
function getIndexForPosition(position)
{var x=0;var count=0;var index=false;for(x in forms){if(forms[x]){count++;if(position==count){index=x;}}}
return index;}
function getPositionForIndex(index)
{var x=0;var position=0;for(x=0;x<=index;x++){if(forms[x]){position++;}}
return position;}
function getIndex()
{return forms.length;}
function getFormsCount()
{return count();}
function getFirstForm()
{if(first()!==false){return getCurrentForm();}else{return false;}}
function getLastForm()
{if(last()!==false){return getCurrentForm();}else{return false;}}
function getNextForm(form)
{if(form){return form.data('nextForm');}else if(current()!==false){if(next()!==false){return getCurrentForm();}else{return false;}}else{return false;}}
function getPreviousForm(form)
{if(form){return form.data('previousForm');}else if(current()!==false){if(previous()!==false){return getCurrentForm();}else{return false;}}else{return false;}}
function getCurrentForm()
{if(current()!==false){return forms[current()];}else{return false;}}
function getForm(position)
{if(hasForms()){if(typeof(position)!='undefined'){setPointerTo(position);return getCurrentForm();}
else{return getLastForm();}}else{return false;}}
function getForms()
{if(hasForms()){first();var x=0;var activeForms=[];for(x=0;x<getFormsCount();x++){activeForms.push(getCurrentForm());next();}
return activeForms;}else{return false;}}
function hasForms()
{return(getFormsCount()>0)?true:false;}
function canAddForm()
{if(options.maxFormsCount==0){return true;}else{return(getFormsCount()<options.maxFormsCount)?true:false;}}
function canRemoveForm()
{return(getFormsCount()>options.minFormsCount)?true:false;}
function canRemoveAllForms()
{return(options.minFormsCount==0)?true:false;}
function isInDom(object)
{if($("#"+object.attr('id')).length>0){return true;}else{return false;}}
function fillData(index,values)
{var form='';if(typeof(index)=='number'){index++;if((index)>getFormsCount()){addForm();}
form=getForm(index);fillForm(form,values);}
else if(typeof(index)=='string'){form=$('#'+index);fillForm(form,values);}}
function fillForm(form,data)
{var x=0;$.each(data,function(index,value){var formId=source.attr('id');var formIndex=form.data('formIndex');if(index.indexOf('#form#')!=-1||index.indexOf('#index#')!=-1){index=index.replace('#form#',formId);index=index.replace('#index#',formIndex);}else{index=formId+'_'+formIndex+'_'+index;}
var field=form.find(':input[id="'+index+'"]');if(field.length==0){field=form.find(':input[name="'+index+'"]');if(field.length==0){field=form.find(':input[name="'+index+'[]"]');}}
if(field.length>0){var mv=false;if(typeof(value)=='object'){mv=true;}
var mf=false;if(field.length>1){mf=true;}
if(mf){if(mv){var fieldsToFill=[];fieldsToFill['fields']=[];fieldsToFill['values']=[];x=0;for(x in value){fieldsToFill['fields'].push(field.filter('[value="'+value[x]+'"]'));fieldsToFill['values'].push(value[x]);}
x=0;for(x in fieldsToFill['fields']){fillFormField(fieldsToFill['fields'][x],fieldsToFill['values'][x]);}}else{fillFormField(field.filter('[value="'+value+'"]',value));}}else{if(mv){x=0;for(x in value){fillFormField(field,value[x]);}}else{fillFormField(field,value);}}}
else{if(form.data('nestedForms').length>0){x=0;for(x in form.data('nestedForms')){if(index==form.data('nestedForms')[x].attr('id')&&typeof(value)=='object'){form.data('nestedForms')[x].inject(value);}}}}});}
function fillFormField(field,value)
{var type=field.attr('type');if(type=='text'||type=='hidden'||type=='password'){field.attr('value',value);return true;}
else if(type=='textarea'){field.text(value);return true;}
else if(type=='checkbox'||type=='radio'){field.attr("checked","checked");return true;}
else if(type=='select-one'||type=='select-multiple'){field.find("option").each(function(){if($(this).text()==value||$(this).attr("value")==value){$(this).attr("selected","selected");}});return true;}else{return false;}}
function hasSeparator()
{if(options.separator!==''){return true;}else{return false;}}
function getSeparator()
{if(hasSeparator()){return $(options.separator);}else{return false;}}
function setOptions(newOptions)
{options=[];options=$.extend(defaults,newOptions);normalizeOptions(options);}
function getOptions()
{return options;}
function initialize()
{source.hide();add=source.find(options.addSelector);addN=source.find(options.addNSelector);addNInput=source.find(options.addNInputSelector);addNButton=source.find(options.addNButtonSelector);removeLast=source.find(options.removeLastSelector);removeCurrent=source.find(options.removeCurrentSelector);removeAll=source.find(options.removeAllSelector);controls=source.find(options.controlsSelector);if(add.length==0){options.allowAdd=false;}
if(addN.length==0){options.allowAddN=false;}
if(removeLast.length==0){options.allowRemoveLast=false;}
if(removeAll.length==0){options.allowRemoveAll=false;}
extendControl(add,options.allowAdd,clickOnAdd);extendControl(addN,options.allowAddN,clickOnAddN,addNButton);extendControl(removeLast,options.allowRemoveLast,clickOnRemoveLast);extendControl(removeAll,options.allowRemoveAll,clickOnRemoveAll);add.init();addN.init();removeLast.init();removeAll.init();templateForm=$(options.formTemplateSelector);noFormsTemplate=$(options.noFormsTemplateSelector);template=templateForm.cloneWithAttribut(true);templateForm.remove();var x=0;if(options.pregeneratedForms.length>0){x=0;for(x in options.pregeneratedForms){addForm(false,options.pregeneratedForms[x]);}}
if(options.iniFormsCount>getFormsCount()){x=0;var b=options.iniFormsCount-getFormsCount();for(x=1;x<=b;x++){addForm(false);}}
if(options.data){source.inject(options.data);}
normalizeAll();source.show();}
function extendControl(control,allowControlOption,onClickFunction,onClickSubControl)
{if(typeof(onClickSubControl)=='undefined'){onClickSubControl=false;}
$.extend(control,{hideIf:function(duration,callback){if(allowControlOption){control.hide(duration,callback);}},showIf:function(duration,callback){if(allowControlOption){control.show(duration,callback);}},init:function(){if(allowControlOption){if(onClickSubControl){onClickSubControl.click(onClickFunction);}else{control.click(onClickFunction);}
control.show();}else{control.hide();}}});}
function extendSource(source)
{$.extend(source,{getAddControl:function(){return add;},getAddNControl:function(){return addN;},getRemoveLastControl:function(){return removeLast;},getRemoveAllControl:function(){return removeAll;},getOptions:function(){return getOptions();},getOption:function(option){return options[option];},setOption:function(option,value){if(typeof(option)!='undefined'&&typeof(value)!='undefined'){options[option]=value;return options[option];}else{return false;}},getForms:function(){return getForms();},getAllForms:function(){return getForms();},getForm:function(val){if(typeof(val)!='undefined'){val++;}
return getForm(val);},getLastForm:function(){return getForm();},getFirstForm:function(){first();return getCurrentForm();},addForm:function(){return addForm();},addNForms:function(n){return addNForms(n);},getFormsCount:function(){return getFormsCount();},hasForms:function(){return hasForms();},canAddForm:function(){return canAddForm();},canRemoveAllForms:function(){return canRemoveAllForms();},canRemoveForm:function(){return canRemoveForm();},removeAllForms:function(){return removeAllForms();},removeLastForm:function(){return removeLastForm();},removeFirstForm:function(){first();return removeForm(getCurrentForm());},removeForm:function(val){if(typeof(val)!='undefined'){val++;}
return removeForm(getForm(val));},inject:function(data){$.each(data,$.proxy(fillData,source));}});}
function extendForm(form)
{$.extend(form,{setLabel:function(newLabel){return setLabelForForm(form,newLabel);},getLabel:function(){return getLabelForForm(form);},inject:function(data){fillForm(form,data);},getNestedForms:function(){return form.data('nestedForms');},getNestedForm:function(val){return form.data('nestedForms')[val];},getPosition:function(){return getPositionForIndex(form.data('formIndex'));},getPreviousForm:function()
{return getPreviousForm(form);},getNextForm:function()
{return getNextForm(form);},removeForm:function()
{return removeForm(form);}});}
function normalizeOptions(options)
{if(options.maxFormsCount>0){if(options.maxFormsCount<options.minFormsCount){options.maxFormsCount=options.minFormsCount;}
if(options.iniFormsCount<options.minFormsCount||options.iniFormsCount>options.maxFormsCount){options.iniFormsCount=options.minFormsCount;}}else{if(options.iniFormsCount<options.minFormsCount){options.iniFormsCount=options.minFormsCount;}}
if(!canRemoveAllForms()){options.allowRemoveAll=false;}}
var source=$(this).first();extendSource(source);var add,addN,addNInput,addNButton,removeLast,removeCurrent,removeAll,controls,template,templateForm,noFormsTemplate,formFields="input, checkbox, select, textarea",forms=[],ip=false,defaults={addSelector:'#'+$(this).attr("id")+'_add',addNSelector:'#'+$(this).attr("id")+'_add_n',addNInputSelector:'#'+$(this).attr("id")+'_add_n_input',addNButtonSelector:'#'+$(this).attr("id")+'_add_n_button',removeLastSelector:'#'+$(this).attr("id")+'_remove_last',removeCurrentSelector:'#'+$(this).attr("id")+'_remove_current',removeAllSelector:'#'+$(this).attr("id")+'_remove_all',controlsSelector:'#'+$(this).attr("id")+'_controls',labelSelector:'#'+$(this).attr("id")+'_label',allowRemoveLast:true,allowRemoveCurrent:true,allowRemoveAll:false,allowAdd:true,allowAddN:false,removeLastConfirmation:false,removeCurrentConfirmation:false,removeAllConfirmation:true,removeLastConfirmationMsg:'Are you sure?',removeCurrentConfirmationMsg:'Are you sure?',removeAllConfirmationMsg:'Are you sure?',formTemplateSelector:'#'+$(this).attr("id")+'_template',noFormsTemplateSelector:'#'+$(this).attr("id")+'_noforms_template',separator:'<div style="width:100%; border-top:1px solid #ff0000; margin: 10px 0px;"></div>',iniFormsCount:1,maxFormsCount:20,minFormsCount:1,incrementCount:1,noFormsMsg:'No forms to display',indexFormat:'#index#',data:[],pregeneratedForms:[],nestedForms:[],isNestedForm:false,parentForm:{},beforeClone:function(){},afterClone:function(){},beforeAdd:function(){},afterAdd:function(){},insertNewForms:'after'};setOptions(options);initialize();return source;};jQuery.fn.cloneWithAttribut=function(withDataAndEvents){if(jQuery.support.noCloneEvent){return $(this).clone(withDataAndEvents);}else{$(this).find("*").each(function(){$(this).data("name",$(this).attr("name"));});var clone=$(this).clone(withDataAndEvents);clone.find("*").each(function(){$(this).attr("name",$(this).data("name"));});return clone;}};})(jQuery);