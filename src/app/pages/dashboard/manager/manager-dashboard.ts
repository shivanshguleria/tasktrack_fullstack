import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header";
// import {MatButtonModule} from '@angular/material/button';
// import {MatCardModule} from '@angular/material/card';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-manager',
  imports: [HeaderComponent, RouterLink],
  templateUrl: './manager-dashboard.html',

})
export class Manager {
   allComponents = [
    {
    name: "Manage Workflows",
    componentDescription: "View all running workflows, create new workflows",
    links: [
      {
      name: "View All Workflows",
      href: "workflows"
    },
    {
      name: "Create New Workflow",
      href: "workflows/new"
    }
    ]
  },
      {
    name: "User Reports",
    componentDescription: "View user reports, measure productivity",
    links: [
      {
      name: "Generate Report",
      href: "reports/generate"
      },
      {
      name: "View All Reports",
      href: "reports/all"
      }
    ]
  }
   ]
}
