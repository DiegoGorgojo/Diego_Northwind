import { ThingGroupDesign } from "sap/suite/ui/commons/library";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Input from "sap/m/Input";
import ComboBox from "sap/m/ComboBox";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import { FilterBar$ClearEvent } from "sap/ui/comp/filterbar/FilterBar";
import Control from "sap/ui/core/Control";
import Event from "sap/ui/base/Event";
import Context from "sap/ui/model/Context";
import ObjectListItem from "sap/m/ObjectListItem";
/**
 * @namespace com.logaligroup.employees.controller
 */
export default class Main extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

this.loadCountries();
    }

   

    private loadCountries () : void {
        const model = new JSONModel();
        model.loadData("../model/Countries.json");
        this.setModel(model, "countries");
    }

    public onFilterSearch () : void {
let oInput = this.byId("filterEmployee") as Input,
    sEmployee = oInput.getValue();

    let oComboBox = this.byId("filterCountry") as ComboBox,
    sCountry = oComboBox.getSelectedKey();

    let aFilters = [];
    if (sEmployee) {
        aFilters.push(
            new Filter({
                filters: [
                 new Filter("FirstName", FilterOperator.Contains, sEmployee ),
                 new Filter("LastName", FilterOperator.Contains, sEmployee)   
                ], 
                and:false
            }));
    }
if (sCountry) {
    aFilters.push(new Filter("Country", FilterOperator.EQ, sCountry))
}
const oTable = this.byId("table") as Table;
const items = oTable.getBinding("items") as ListBinding;
items.filter(aFilters);
    }

    public onClearPress (event: FilterBar$ClearEvent) : void {
const controls = event.getParameter("selectionSet") as Control[];
const oInput = controls[0] as Input;
const oComboBox = controls[1] as ComboBox;
oInput.setValue("");
oComboBox.setSelectedKey("");
this.onFilterSearch();

    }
    public onNavToDetails (event : Event) : void {
const item = event.getSource() as ObjectListItem;
const bindingContext = item.getBindingContext("northwind") as Context ;
const id = bindingContext.getProperty("EmployeeID");
const router = this.getRouter();
const viewModel = this.getModel("view") as JSONModel;
viewModel.setProperty("/layout", "TwoColumnsMidExpanded");
/**console.log(parseInt(id)); **/
router.navTo("RouteDetails", {
/**    id: parseInt(id) - 1  */ 
id: id
});
/**console.log(bindingContext.getObject()); **/
    }
}