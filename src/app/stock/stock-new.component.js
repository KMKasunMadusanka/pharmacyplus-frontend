angular
  .module('app')
  .component('stockNewCom', {
    templateUrl: 'app/stock/template/stock-new.html',
    controller: function ($log, $q, StockSDK, SweetAlert) {
      var self = this;

      self.drugNew = [];
      self.drugNew.selectedDrugCategory = '9999';
      self.drugNew.selectedDosage = '9999';
      self.drugNew.selectedFrequency = '9999';

      for (var i = angular.element('.form-body select').length - 1; i >= 0 ; i--) {
        angular.element('.form-body select')[i].focus();
      }
      angular.element('body')[0].scrollTop = 0;

      self.drugCategories = [];
      self.drugDosages = [];
      self.drugFrequencies = [];

      // Process
      self.isNewDrugProcessing = false;

      /**
       * Get Drug Categories
      */
      function getDrugCategories() {
        var deferred = $q.defer();
        StockSDK.getDrugCategories().then(function (response) {
          self.drugCategories = response.content;
          $log.log("*********self.drugCategories********");
          $log.log(self.drugCategories);
          deferred.resolve(response);
        }, function (error) {
          $log.debug(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }
      getDrugCategories();

      /**
       * Get Drug Dosage
      */
      function getDrugDosage() {
        var deferred = $q.defer();
        StockSDK.getDrugDosages().then(function (response) {
          self.drugDosages = response.content;
          $log.log("*********self.drugDosages********");
          $log.log(self.drugDosages);
          deferred.resolve(response);
        }, function (error) {
          $log.debug(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }
      getDrugDosage();

      /**
       * Get Drug Frequency
      */
      function getDrugFrequency() {
        var deferred = $q.defer();
        StockSDK.getDrugFrequencies().then(function (response) {
          self.drugFrequencies = response.content;
          $log.log("*********self.drugFrequencies********");
          $log.log(self.drugFrequencies);
          deferred.resolve(response);
        }, function (error) {
          $log.debug(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }
      getDrugFrequency();

      /**
       * Drug Submit Event
      */
      self.stockSubmitBtnClicked = false;
      function onNewDrugSubmit() {
        self.stockSubmitBtnClicked = true;

        $log.log("self.drugNew");
        $log.log(self.drugNew);

        $log.log("self.stockNewForm");
        $log.log(self.stockNewForm);

        self.drugItemDB = {
          category: Number(self.drugNew.selectedDrugCategory),
          name: self.drugNew.drugName,
          type: self.drugNew.drugType,
          price: self.drugNew.drugPrice,
          dangerlevel: Number(self.drugNew.drugDangerLevel),
          reorderlevel: Number(self.drugNew.drugReorderLevel),
          dosage: Number(self.drugNew.selectedDosage),
          frequency: Number(self.drugNew.selectedFrequency),
        }

        if (self.drugNew.drugRemarks !== null || self.drugNew.drugRemarks !== "") {
          self.drugItemDB.remarks = self.drugNew.drugRemarks;
        }

        $log.log(self.drugItemDB);
        if (self.stockNewForm.$valid && self.drugNew.selectedDrugCategory !== '9999' && self.drugNew.selectedDosage !== '9999' && self.drugNew.selectedFrequency !== '9999') {
          $log.log("New Drug created called");

          createDrug(self.drugItemDB);
        }
      }

      /**
       * API call event
      */
      function createDrug(newEventObj) {
        self.isNewDrugProcessing = true;
        var deferred = $q.defer();
        StockSDK.makeDrug(newEventObj).then(function (response) {
          if (response.status === 201) {
            SweetAlert.swal({
              title: "Drug created successfully.",
              type: "success",
              timer: 2000,
              showConfirmButton: false
            }, function () {
              SweetAlert.close();
            });
          }
          $log.log(response);
          deferred.resolve(response);
          resetDrugFormData();
          self.isNewDrugProcessing = false;
        }, function (error) {
          $log.error(error);
          SweetAlert.swal({
            title: "Oops! Something went wrong. Please try again.",
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }, function () {
            SweetAlert.close();
          });
          deferred.reject(error);
          self.isNewDrugProcessing = false;
        });
        return deferred.promise;
      }

      /**
       * Reset Drug form
      */
      function resetDrugFormData() {
        self.drugItemDB = [];
        self.drugNew = [];
        self.drugNew.selectedDrugCategory = '9999';
        self.drugNew.selectedDosage = '9999';
        self.drugNew.selectedFrequency = '9999';
        self.stockSubmitBtnClicked = false;
      }

      /**
       * Public methods
      */
      self.onNewDrugSubmit = onNewDrugSubmit;

    }
  });
