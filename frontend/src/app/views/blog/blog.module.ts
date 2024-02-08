import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { ArticlesComponent } from './articles/articles.component';
import {SharedModule} from "../../shared/shared.module";
import { ArticleComponent } from './article/article.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [
    ArticlesComponent,
    ArticleComponent
  ],
	imports: [
		CommonModule,
		BlogRoutingModule,
		SharedModule,
		ReactiveFormsModule,
    MatTooltipModule
	]
})
export class BlogModule { }
