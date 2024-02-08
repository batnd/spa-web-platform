import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ServiceCardType} from "../../../types/service-card.type";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleCardType} from "../../../types/article-card.type";
import {ReviewCardType} from "../../../types/review-card.type";
import {clientsReviews} from "../../../assets/text/reviews/clients-reviews";
import {servicesTypes} from "../../../assets/text/services/services-types";
import {MatDialog} from "@angular/material/dialog";
import {ModalPopupComponent} from "../../shared/components/modal-popup/modal-popup.component";
import {ActivatedRoute,} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  private articleService: ArticleService = inject(ArticleService);
  private dialog: MatDialog = inject(MatDialog);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public carouselCustomOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 700,
    autoplayTimeout: 5000,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    slideTransition: 'linear',
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  };
  public reviewCarouselCustomOptions: OwlOptions = {
    items: 3,
    margin: 24,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    slideTransition: 'linear'
  };
  public serviceCardsData: ServiceCardType[] = servicesTypes;
  public reviewCardsData: ReviewCardType[] = clientsReviews;
  public popularArticles: ArticleCardType[] = [];

  @ViewChild('services', {static: true})
  private elementServices: ElementRef | null = null;
  @ViewChild('about', {static: true})
  private elementAbout: ElementRef | null = null;
  @ViewChild('reviews', {static: true})
  private elementReviews: ElementRef | null = null;
  @ViewChild('contacts', {static: true})
  private elementContacts: ElementRef | null = null;

  ngOnInit(): void {
    this.articleService.getPopularArticles()
      .subscribe((articles: ArticleCardType[]) => this.popularArticles = articles);
  }

  public showPopup(serviceTypeValue: string): void {
    this.dialog.open(ModalPopupComponent,
      {
        data: {
          type: serviceTypeValue
        },
        autoFocus: false
      });
  }

  ngAfterViewInit() {
    this.activatedRoute.fragment.subscribe((fragment: string | null): void => {
      if (fragment === 'services') this.scrollTo(this.elementServices?.nativeElement);
      if (fragment === 'about') this.scrollTo(this.elementAbout?.nativeElement);
      if (fragment === 'reviews') this.scrollTo(this.elementReviews?.nativeElement);
      if (fragment === 'contacts') this.scrollTo(this.elementContacts?.nativeElement);
    });
  }

  private scrollTo(target: HTMLElement | null): void {
    setTimeout((): void => {
      target?.scrollIntoView({behavior: "smooth"});
    }, 100);
  }
}
