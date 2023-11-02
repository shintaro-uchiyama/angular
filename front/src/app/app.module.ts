import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxMoveableModule } from 'ngx-moveable';
import { FabricComponent } from './fabric/fabric.component';
import { MoveableComponent } from './moveable/moveable.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    FabricComponent,
    MoveableComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxMoveableModule,
    RouterModule.forRoot([
      { path: 'fabric', component: FabricComponent },
      { path: 'moveable', component: MoveableComponent },
      { path: '', redirectTo: '/fabric', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
