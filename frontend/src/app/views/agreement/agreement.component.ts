import {AfterViewInit, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements AfterViewInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild('agreement', {static: true})
  private elementAgreement: ElementRef | null = null;
  @ViewChild('personal', {static: true})
  private elementPersonal: ElementRef | null = null;

  ngAfterViewInit() {
    this.activatedRoute.fragment.subscribe((fragment: string | null): void => {
      if (fragment) {
        if (fragment === 'agreement') this.scrollTo(this.elementAgreement?.nativeElement);
        if (fragment === 'personal') this.scrollTo(this.elementPersonal?.nativeElement);
      }
    });
  }

  private scrollTo(target: HTMLElement): void {
    setTimeout(() => {
      target.scrollIntoView({behavior: 'smooth'});
    }, 100);
  }
}
