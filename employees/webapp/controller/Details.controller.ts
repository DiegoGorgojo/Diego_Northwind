import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import Panel from "sap/m/Panel";
import Button, { Button$PressEvent } from "sap/m/Button";
import Toolbar from "sap/m/Toolbar";
import Context from "sap/ui/model/Context";
import Utils from "../utils/utils";
import FilterOperator from "sap/ui/model/FilterOperator";
import Filter from "sap/ui/model/Filter";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import {DatePicker$ChangeEvent} from "sap/m/DatePicker";
import {Input$ChangeEvent} from "sap/ui/webc/main/Input";
import {Input$LiveChangeEvent} from "sap/m/Input";
import {Select$ChangeEvent} from "sap/m/Select";
import { UploadSetwithTableActionPlaceHolder } from "sap/m/library";
import ObjectListItem from "sap/m/ObjectListItem";
import Event from "sap/ui/base/Event";
/**
 * @namespace com.logaligroup.employees.view.controller
 */

export default class Details extends BaseController {

  panel : Panel;

    public onInit(): void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this.onObjectMatched.bind(this));
    this.formModel();
      }
    private formModel () : void {
      const model = new JSONModel([]);
      this.setModel(model, "form");
    }

    private onObjectMatched (event : Route$PatternMatchedEvent ) : void {

/**      console.log(event.getParameters());  */ 
      
       const arg = <any> event.getParameter("arguments"); 
       const id = arg.id;
       const view = this.getView() as View;
       const $this = this;
      /**  console.log(id); */
      view.bindElement({
        path:`/Employees(${id})/`,
        model: 'northwind',
        events: {
          change: function () {
            $this.read();
          },
          dataRequest: function () {

          },
          dataReceived: function () {

          }   
       }
      });
    }

    public onClosePress () : void {
      const router = this.getRouter();
      const viewModel = this.getModel("view") as JSONModel;
      viewModel.setProperty("/layout", "OneColumn")
      router.navTo("RouteMain");

    }
private removeAllContent () : void {

  const panel = this.byId("tableIncidence") as Panel;
  panel.removeAllContent();
}
    public async onCreateIncidencePress () : Promise<void> {
const panel = this.byId("tableIncidence") as Panel;

const formModel = this.getModel("form") as JSONModel;
const aData = formModel.getData();

/** console.log(aData); **/
const index = aData.length;
/** console.log(index); **/
aData.push({Index: index + 1});
formModel.refresh();

/** console.log(aData); **/

this.panel = await <Promise<Panel>> this.loadFragment({
  name: "com.logaligroup.employees.fragment.NewIncidence"
});

this.panel.bindElement({
  path: 'form>/'+index,
  model: 'form'
});
panel.addContent(this.panel);
    }

    public async onSavePress (event: Button$PressEvent) : Promise<void> {
      console.log("estoy a punto de crear un nuevo registro");
      const button = event.getSource() as Button;
      const toolbar = button.getParent() as Toolbar;
      const panel = toolbar.getParent() as Panel;
      const bindingContext = panel.getBindingContext("form") as Context;
      //console.log(bindingContext.getObject());
      const northwind = this.getView()?.getBindingContext("northwind");
      const utils = new Utils(this);

      let sapId = utils.getSapId();
      let employeeId = (northwind?.getProperty("EmployeeID") as number).toString();
     

if (typeof bindingContext.getProperty("IncidenceId") === 'undefined') {
  
  let object = {
    path: '/IncidentsSet',
    data: {
      SapId: utils.getSapId(),
      EmployeeId: employeeId,
      CreationDate: bindingContext.getProperty("CreationDate"),
      Type: bindingContext.getProperty("Type"),
      Reason: bindingContext.getProperty("Reason")
    },
    filters:[
      new Filter("SapId", FilterOperator.EQ, utils.getSapId()),
      new Filter("EmployeeId", FilterOperator.EQ, employeeId)
    ] 
  };
  //console.log(object);
  const results = await utils.crud('create', new JSONModel(object));
  this.showIncidents(results);
} else {
  
  const incidenceId = bindingContext.getProperty("IncidenceId");
  const sapId = utils.getSapId();
  const employeeId = (northwind?.getProperty("EmployeeID") as number).toString();
  const object = {
  path: `/IncidentsSet(IncidenceId='${incidenceId}' , SapId='${sapId}' , EmployeeId='${employeeId}' )` ,
  data: { 
     SapId:       sapId,
    EmployeeId:   incidenceId,
    CreationDate: bindingContext.getProperty("CreationDate"),
    Type: bindingContext.getProperty("Type"),
    Reason: bindingContext.getProperty("Reason"),

    CreationDateX: bindingContext.getProperty("CreationDateX"),
    TypeX: bindingContext.getProperty("TypeX"),
    ReasonX: bindingContext.getProperty("ReasonX")

  },
  filters:[
    new Filter("SapId", FilterOperator.EQ, utils.getSapId()),
    new Filter("EmployeeId", FilterOperator.EQ, employeeId)
  ] 
  }

  const results = await utils.crud('update', new JSONModel(object));
  this.showIncidents(results);

}
      
    }
    private async read () : Promise<void> {
      const utils = new Utils(this);
      const northwind = this.getView()?.getBindingContext("northwind");
      const sEmployeeId= (northwind?.getProperty("EmployeeID") as number).toString();
      const sSapId = utils.getSapId();

      const object = {
        path: '/IncidentsSet',
        filters: [
          new Filter("SapId", FilterOperator.EQ, sSapId),
          new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId)
        ]
      

      };
      const results = await utils.read(new JSONModel(object));
      //console.log(results);
      this.showIncidents(results);
    }
    private showIncidents (results : ODataListBinding | void) {
      //limpiar incidencias
      const panel = this.byId("tableIncidence") as Panel;
      panel.removeAllContent();
      //setear el tipo de dato
      const array = results as any;
      const formModel = this.getModel("form") as JSONModel;
      formModel.setData(array.results);
      //console.log(array);
      //hacer el mapeo
      array.results.forEach( async (incidence : object, index : number) => {

        const newIncidence = await <Promise<Panel>> this.loadFragment({name: "com.logaligroup.employees.fragment.NewIncidence"});
      newIncidence.bindElement("form>/"+index);
      panel.addContent(newIncidence);
      });
    }
    public async onDeletePress(event: Button$PressEvent) : Promise<void> {
const button = event.getSource() as Button;
const toolbar = button.getParent() as Toolbar;
const panel = toolbar.getParent() as Panel;
const form = panel.getBindingContext("form");
const incidenceId = form?.getProperty("IncidenceId");
const sapId = form?.getProperty("SapId");
const employeeId = form?.getProperty("EmployeeId");

let object = {
  path :  `/IncidentsSet(IncidenceId='${incidenceId}' , SapId='${sapId}' , EmployeeId='${employeeId}' )` 
  ,
  filters:[
    new Filter("SapId", FilterOperator.EQ, sapId),
    new Filter("EmployeeId", FilterOperator.EQ, employeeId)
  ] 
};
const utils = new Utils(this);
const results = await utils.crud('delete', new JSONModel(object));
this.showIncidents(results);
    }

    public updateIncidenceCreationdate (event : DatePicker$ChangeEvent) : void {

 const context = event.getSource().getBindingContext("form") as Context;
let object = context.getObject() as any;
object.CreationDateX = true;
console.log(object);
}

public updateIncidenceReason (event : Input$ChangeEvent) : void {

  const context = event.getSource().getBindingContext("form") as Context;
 let object = context.getObject() as any;
 object.ReasonX = true;
 }

 public updateIncidenceType (event : Select$ChangeEvent) : void {

  const context = event.getSource().getBindingContext("form") as Context;
 let object = context.getObject() as any;
 object.TypeX = true;
 }
 public onNavToOrderDetails (event: Event) : void {
  const item = event.getSource() as ObjectListItem;
  const bindingContext = item.getBindingContext("northwind") as Context;
  const sEmployeeId = bindingContext.getProperty("EmployeeID").toString();
  const sOrderId = bindingContext.getProperty("OrderId").toString();
  //console.log(sEmployeeId);
  //console.log(sOrderId);
  //console.log(bindingContext.getPath());
console.log(bindingContext.getPath());

  const viewModel = this.getModel("view") as JSONModel;
  viewModel.setProperty("/layout", "EndColumnFullScreen");

  const router = this.getRouter();
  router.navTo("RouterOrderdetails", {
    employeeId: sEmployeeId, 
    orderId: sOrderId
  });
 }
}