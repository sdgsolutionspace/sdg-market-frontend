import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSellOfferService } from 'src/app/services/api/api-sell-offer.service';
import { ToastrService } from 'ngx-toastr';
import { SellOffer } from 'src/app/interfaces/sell-offer';
import { ApiPurchaseOfferService } from 'src/app/services/api/api-purchase-offer.service';
import { PurchaseOffer } from 'src/app/interfaces/purchase-offer';
import { Contribution } from 'src/app/interfaces/contribution';
import { GitProject } from 'src/app/interfaces/git-project';
import { GitProjectApiService } from 'src/app/services/api/git-project-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-project-auction',
  templateUrl: './project-auction.component.html',
  styleUrls: ['./project-auction.component.scss']
})
export class ProjectAuctionComponent implements OnInit {
  title = 'Developers Market';
  selectedTab = 0;
  public sellForm: FormGroup;
  public sellFormToExisting: FormGroup;
  public purchaseOfferForm: FormGroup;
  public buyForm: FormGroup;

  public projectId: number;
  public selectedBid: number;
  public sellFormSubmitted = false;
  public sellFormToExistingSubmitted = false;
  public purchaseOfferFormSubmitted = false;
  public buyFormSumitted = false;
  public currentSellFormBuying: SellOffer;
  public currentBuyFormSelling: PurchaseOffer;

  public currentSales: Array<SellOffer> = null;
  public currentPurchaseOffers: Array<PurchaseOffer> = null;
  public currentContributions: Array<Contribution>;
  public currentProject: GitProject;

  public buyingFormDisabled = false;
  public sellingFormDisabled = false;

  @ViewChild('sellModalCloseButton') sellModalCloseButton: ElementRef;
  @ViewChild('sellOfferToExistingModalCloseButton') sellOfferToExistingModalCloseButton: ElementRef;
  @ViewChild('purchaseOfferModalCloseButton')
  purchaseOfferModalCloseButton: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sellOfferApi: ApiSellOfferService,
    private purchaseOfferApi: ApiPurchaseOfferService,
    public toastr: ToastrService,
    public router: Router,
    private projectApi: GitProjectApiService,
    private sellApi: ApiSellOfferService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
  }

  private generateSellingForm() {
    this.sellFormSubmitted = false;
    this.sellForm = this.fb.group({
      number_of_tokens: [1, [Validators.required]],
      sell_price_per_token: [1, [Validators.required]],
      project: [this.projectId, [Validators.required]]
    });
  }

  private generateSellToExistingForm() {
    this.sellFormToExistingSubmitted = false;
    this.sellFormToExisting = this.fb.group({
      nb_tokens: [0, [Validators.required]],
    });
  }

  private generateBuyForm(sellForm: number) {
    this.buyFormSumitted = false;
    this.buyForm = this.fb.group({
      nb_tokens: [0, [Validators.required]],
      sell_offer: [sellForm, [Validators.required]]
    });
  }

  private generatePurchaseOfferForm() {
    this.purchaseOfferFormSubmitted = false;

    this.purchaseOfferForm = this.fb.group({
      number_of_tokens: [1, [Validators.required]],
      purchase_price_per_token: [1, [Validators.required]],
      project: [this.projectId, [Validators.required]]
    });
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.params['id'];

    this.projectApi
      .get(this.projectId)
      .toPromise()
      .then(project => {
        this.currentProject = project;
      })
      .catch(err => {
        console.log(err);
      });

    this.generateSellingForm();
    this.generatePurchaseOfferForm();
    this.refreshSellOffer();
    this.refreshPurchasesOffer();
  }

  public refreshSellOffer() {
    this.sellOfferApi
      .getAll(this.projectId)
      .toPromise()
      .then(sales => {
        this.currentSales = sales;
        console.log('Selling offers', sales);
      });
  }

  public buyTokens(modalForm, sellOffer: SellOffer) {
    console.log('Sell Offer selected', sellOffer, modalForm);
    this.modalService.open(modalForm);
    this.currentSellFormBuying = sellOffer;
    this.generateBuyForm(sellOffer.id);
  }

  public sellToExisting(modalForm, buyOffer: PurchaseOffer) {
    console.log('Buy Offer selected', buyOffer, modalForm);
    this.modalService.open(modalForm);
    this.currentBuyFormSelling = buyOffer;
    this.selectedBid = buyOffer.id;
    this.generateSellToExistingForm();
  }

  public closeBuyModalForm() {
    this.modalService.dismissAll();
  }

  public closeSellToExistingModalForm() {
    this.modalService.dismissAll();
  }

  public refreshPurchasesOffer() {
    this.purchaseOfferApi
      .getAll(this.projectId)
      .toPromise()
      .then(purchasesOffer => {
        this.currentPurchaseOffers = purchasesOffer;
        console.log('Purchases offers', purchasesOffer);
      });
  }

  public onNbOfTokensToBuyChange(
    nbOfTokens: number,
    totalPriceField: HTMLInputElement
  ) {
    const totalPrice =
      nbOfTokens * parseFloat(this.currentSellFormBuying.sell_price_per_token);
    totalPriceField.value = totalPrice.toFixed(2);
  }

  public onNbOfTokensToSellChange(
    nbOfTokens: number,
    totalPriceField: HTMLInputElement
  ) {
    const totalPrice =
      nbOfTokens * parseFloat(this.currentBuyFormSelling.purchase_price_per_token);
    totalPriceField.value = totalPrice.toFixed(2);
  }

  public submitSellForm() {
    const formValue = this.sellForm.value;

    this.sellFormSubmitted = true;
    if (this.sellForm.valid) {
      this.sellingFormDisabled = true;
      this.sellOfferApi
        .create(formValue)
        .toPromise()
        .then(data => {
          this.sellModalCloseButton.nativeElement.click();
          this.generateSellingForm();
          this.refreshSellOffer();
          console.log('success', data);
          this.toastr.success(
            'The data have been saved successfully',
            'Data saved'
          );
        })
        .catch(error => {
          console.log(error);
          this.toastr.error('An error occurred while saving your data', error);
        })
        .then(() => {
          this.sellingFormDisabled = false;
        });
    }
  }


  public submitSellFormToExisting() {
    const formValue = this.sellFormToExisting.value;

    this.sellFormSubmitted = true;
    if (this.sellForm.valid) {
      this.sellingFormDisabled = true;
      this.purchaseOfferApi
        .sellToExistingBid(this.selectedBid, formValue)
        .toPromise()
        .then(data => {
          this.modalService.dismissAll();
          this.generateSellingForm();
          this.refreshSellOffer();
          console.log('success', data);
          this.toastr.success(
            'The data have been saved successfully',
            'Data saved'
          );
        })
        .catch(error => {
          let errorMsg = "";
          if (error.error.code == 400) {
            for (let id in error.error.errors.children) {
              errorMsg += `${id} : ${error.error.errors.children[id].errors.join(". ")}`
            }
          }
          this.toastr.error(errorMsg ? errorMsg : 'Unknown error', 'An error occurred while saving your data');
        })
        .then(() => {
          this.sellingFormDisabled = false;
        });
    }
  }

  public submitBuyingForm() {
    const formValue = this.buyForm.value;

    this.buyFormSumitted = true;
    this.buyingFormDisabled = true;

    if (this.buyForm.valid) {
      this.sellApi
        .buy(formValue)
        .toPromise()
        .then(data => {
          this.authService.refreshUser();
          this.sellModalCloseButton.nativeElement.click();
          this.closeBuyModalForm();
          this.refreshSellOffer();
          this.toastr.success(
            'Your transaction is complete',
            'Transaction complete'
          );
        })
        .catch(error => {
          console.log(error);
          this.toastr.error('An error occurred while saving your data', error);
          console.log('ERROR', error.error.errors.children);
          if (
            error.error &&
            error.error.errors &&
            error.error.errors.children &&
            error.error.errors.children.nbTokens.errors
          ) {
            console.log('there is an error');
            this.buyForm.get('nb_tokens').setErrors({
              nbTokens: error.error.errors.children.nbTokens.errors.join('<br>')
            });
          }
        })
        .then(() => {
          this.buyFormSumitted = false;
          this.buyingFormDisabled = false;
        });
    }
  }

  public submitPurchaseOfferForm() {
    const formValue = this.purchaseOfferForm.value;
    this.purchaseOfferFormSubmitted = true;
    if (this.purchaseOfferForm.valid) {
      this.buyingFormDisabled = true;
      this.purchaseOfferApi
        .create(formValue)
        .toPromise()
        .then(data => {
          this.purchaseOfferModalCloseButton.nativeElement.click();
          this.generatePurchaseOfferForm();
          this.refreshPurchasesOffer();
          this.toastr.success(
            'The data have been saved successfully',
            'Data saved'
          );
        })
        .catch(error => {
          console.log(error);
          this.toastr.error('An error occurred while saving your data', error);
        })
        .then(() => {
          this.buyingFormDisabled = false;
          this.purchaseOfferFormSubmitted = false;
        });
    }
  }
}
