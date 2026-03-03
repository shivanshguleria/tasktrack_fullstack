import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Role } from './shared/enums/role.enum';

export const routes: Routes = [

  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./pages/auth/signup/signup').then(m => m.SignupComponent) 
  },

  //ADMIN SECTION 
  { 
    path: 'admin', 
    canActivate: [authGuard], 
    data: { roles: [Role.ADMIN] },
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/dashboard/admin/admin-dashboard').then(m => m.AdminDashboardComponent) 
      },
      { 
        path: 'approve', 
        loadComponent: () => import('./pages/dashboard/admin/approve-users/approve-users').then(m => m.ApproveUsersComponent) 
      },
      { 
        path: 'users', 
        loadComponent: () => import('./pages/dashboard/admin/manage-users/manage-users').then(m => m.ManageUsersComponent) 
      }
      ,
      {
      path: 'reports/generate', 
      loadComponent: () => import('./pages/dashboard/admin/report/generate/report').then(m => m.AdminReportComponent)
    },
    {
      path: 'reports/all', 
      loadComponent: () => import('./pages/dashboard/admin/report/view/view.report').then(m => m.ReportListComponent)
    } 
      
    
]
  },

  
  {
    path: 'manager',
    canActivate: [authGuard],
    data: { roles: [Role.MANAGER] },
    children: [
      { 
        path: '', 
        // Ensure this path matches your actual folder/file name exactly
        loadComponent: () => import('./pages/dashboard/manager/manager-dashboard').then(m => m.Manager) 
      },
            { 
        path: 'workflows', 
        // Ensure this path matches your actual folder/file name exactly
        loadComponent: () => import('./pages/dashboard/manager/dashboard/manager/workflow/view-all/view-all').then(m => m.ViewAll) 
      },
              { 
        path: 'workflows/new', 
        // Ensure this path matches your actual folder/file name exactly
        // redirectTo: "workflows"
        loadComponent: () => import('./pages/dashboard/manager/dashboard/manager/workflow/create-new-workflow/create-new-workflow').then(m => m.CreateNewWorkflow) 
      },
          { 
        path: 'workflows/:workflowId', 
        // Ensure this path matches your actual folder/file name exactly
        loadComponent: () => import('./pages/dashboard/manager/dashboard/manager/workflow/view-workflow/view-workflow')
      },
       {
        path: 'reports/generate', 
        loadComponent: () => import('./pages/dashboard/manager/report/generate/manager-report').then(m => m.ManagerReportComponent)
      },
      {
        path: 'reports/all',
       loadComponent: () => import('./pages/dashboard/manager/report/view/manager-report-view').then(m => m.ManagerReportListComponent)
      }

    ]
  },

  //  CATCH-ALLS
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } 
];