(function () {
  "use strict";
  var obj1, temp, opr, comp;
  var main,
    deletefin = [];
  var finanacecode = [];
  var simsController = angular.module("sims.module.Library");

  simsController.run(function ($rootScope, $templateCache) {
    $rootScope.$on("$viewContentLoaded", function () {
      $templateCache.removeAll();
    });
  });

  simsController.controller("LibraryBinCont", [
    "$scope",
    "$state",
    "$rootScope",
    "$timeout",
    "gettextCatalog",
    "$http",
    "ENV",
    function (
      $scope,
      $state,
      $rootScope,
      $timeout,
      gettextCatalog,
      $http,
      ENV
    ) {
      $scope.pagesize = "10";
      $scope.pageindex = 0;
      $scope.save_btn = true;
      var dataforSave = [];
      $scope.Update_btn = false;
      $scope.display = false;
      $scope.table = true;
      //$scope.cmbstatus = true;
      //$scope.checked = false;

      $timeout(function () {
        $("#fixTable").tableHeadFixer({ top: 1 });
      }, 100);

      //$scope.countData = [
      // { val: 5, data: 5 },
      // { val: 10, data: 10 },
      // { val: 15, data: 15 },
      //]

      //Select Data SHOW
      $http
        .get(ENV.apiUrl + "api/LibraryBin/GetSims_LibraryLocation")
        .then(function (res) {
          $scope.location = res.data;
        });
      $http
        .get(ENV.apiUrl + "api/LibraryBin/GetSims_LibraryBin")
        .then(function (res1) {
          $scope.CreDiv = res1.data;
          $scope.totalItems = $scope.CreDiv.length;
          // $scope.countData.push({ val: $scope.CreDiv.length, data: 'All' })
          $scope.todos = $scope.CreDiv;
          $scope.makeTodos();
        });

      $scope.propertyName = null;
      $scope.reverse = false;

      $scope.sortBy = function (propertyName) {
        $scope.reverse =
          $scope.propertyName === propertyName ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
      };

      //$scope.size = function (str) {
      //    console.log(str);
      //    $scope.pagesize = str;
      //    $scope.currentPage = 1;
      //    $scope.numPerPage = str;
      //    console.log("numPerPage=" + $scope.numPerPage); $scope.makeTodos();
      //}

      //$scope.size = function (str) {
      //    debugger;
      //    if (str == "All") {
      //        $scope.currentPage = '1';
      //        $scope.filteredTodos = $scope.CreDiv;
      //        $scope.pager = false;
      //    }
      //    else {
      //        $scope.pager = true;
      //        $scope.pagesize = str;
      //        $scope.currentPage = 1;
      //        $scope.numPerPage = str;
      //        $scope.makeTodos();
      //    }
      //}

      //$scope.index = function (str) {
      //    $scope.pageindex = str;
      //    $scope.currentPage = str;
      //    console.log("currentPage=" + $scope.currentPage); $scope.makeTodos();
      //    main.checked = false;
      //    $scope.CheckAllChecked();
      //}

      $scope.size = function (str) {
        debugger;
        main = document.getElementById("mainchk");
        if (main.checked == true) {
          main.checked = false;
          $scope.row1 = "";
          $scope.color = "#edefef";
        }

        if (str == "All") {
          $scope.currentPage = 1;
          $scope.numPerPage = $scope.CreDiv.length;
          $scope.makeTodos();
        } else {
          $scope.pagesize = str;
          $scope.currentPage = 1;
          $scope.numPerPage = str;
          $scope.makeTodos();
        }
      };

      $scope.index = function (str) {
        $scope.pageindex = str;
        $scope.currentPage = str;
        $scope.makeTodos();

        main = document.getElementById("mainchk");
        if (main.checked == true) {
          main.checked = false;
          $scope.row1 = "";
          $scope.color = "#edefef";
        }
      };

      ($scope.filteredTodos = []),
        ($scope.currentPage = 1),
        ($scope.numPerPage = 10),
        ($scope.maxSize = 10);

      $scope.makeTodos = function () {
        var rem = parseInt($scope.totalItems % $scope.numPerPage);
        if (rem == "0") {
          $scope.pagersize = parseInt($scope.totalItems / $scope.numPerPage);
        } else {
          $scope.pagersize =
            parseInt($scope.totalItems / $scope.numPerPage) + 1;
        }

        var begin = ($scope.currentPage - 1) * $scope.numPerPage;
        var end = parseInt(begin) + parseInt($scope.numPerPage);

        console.log("begin=" + begin);
        console.log("end=" + end);

        $scope.filteredTodos = $scope.todos.slice(begin, end);
      };

      $scope.searched = function (valLists, toSearch) {
        return _.filter(
          valLists,

          function (i) {
            /* Search Text in all  fields */
            return searchUtil(i, toSearch);
          }
        );
      };

      //Search
      $scope.search = function () {
        debugger;
        $scope.todos = $scope.searched($scope.CreDiv, $scope.searchText);
        $scope.totalItems = $scope.todos.length;
        $scope.currentPage = "1";
        if ($scope.searchText == "") {
          $scope.todos = $scope.CreDiv;
        }
        $scope.makeTodos();
        main.checked = false;
        $scope.CheckAllChecked();
      };

      function searchUtil(item, toSearch) {
        /* Search Text in all 3 fields */
        return item.sims_library_bin_desc
          .toLowerCase()
          .indexOf(toSearch.toLowerCase()) > -1 ||
          item.sims_library_bin_code == toSearch
          ? true
          : false;
      }

      //NEW BUTTON
      $scope.New = function () {
        $scope.disabled = false;

        $scope.gdisabled = false;
        $scope.aydisabled = false;
        $scope.table = false;
        $scope.display = true;
        $scope.save_btn = true;
        $scope.Update_btn = false;
        $scope.divcode_readonly = false;
        //$scope.searchText = '';
        $scope.temp = "";
        //  $scope.temp = [];

        $scope.Myform.$setPristine();
        $scope.Myform.$setUntouched();

        //$scope.temp['sims_library_attribute_status'] = true;
      };

      //DATA CANCEL
      $scope.Cancel = function () {
        $scope.temp = "";
        $scope.table = true;
        $scope.display = false;
        $scope.Myform.$setPristine();
        $scope.Myform.$setUntouched();
      };

      //DATA EDIT
      $scope.edit = function (str) {
        $scope.gdisabled = false;
        $scope.aydisabled = true;
        $scope.table = false;
        $scope.display = true;
        $scope.save_btn = false;
        $scope.Update_btn = true;
        $scope.divcode_readonly = true;

        $scope.temp = {
          sims_library_bin_code: str.sims_library_bin_code,
          sims_library_bin_desc: str.sims_library_bin_desc,
          sims_library_location_code: str.sims_library_location_code,
          sims_library_location_name: str.sims_library_location_name,
        };
      };

      //DATA SAVE INSERT
      var datasend = [];
      $scope.savedata = function (Myform) {
        debugger;
        if (Myform) {
          var data = $scope.temp;
          data.opr = "I";
          datasend.push(data);
          $http
            .post(ENV.apiUrl + "api/LibraryBin/CUDLibraryBin", datasend)
            .then(function (msg) {
              $scope.msg1 = msg.data;

              if ($scope.msg1 == true) {
                swal({
                  text: "Library Bin Added Successfully",
                  imageUrl: "assets/img/check.png",
                  showCloseButton: true,
                  width: 300,
                  height: 200,
                });
                $scope.getgrid();
              } else {
                swal({
                  text: "Library Bin Code Already present.",
                  imageUrl: "assets/img/close.png",
                  showCloseButton: true,
                  width: 300,
                  height: 200,
                });
              }

              $http
                .get(ENV.apiUrl + "api/LibraryBin/GetSims_LibraryBin")
                .then(function (res1) {
                  $scope.CreDiv = res1.data;
                  $scope.totalItems = $scope.CreDiv.length;
                  $scope.todos = $scope.CreDiv;
                  $scope.makeTodos();
                });
            });
          datasend = [];
          $scope.table = true;
          $scope.display = false;
        }
      };

      //DATA UPDATE
      var dataforUpdate = [];
      $scope.update = function (Myform) {
        if (Myform) {
          var data = $scope.temp;
          data.opr = "U";
          dataforUpdate.push(data);
          //dataupdate.push(data);
          $http
            .post(ENV.apiUrl + "api/LibraryBin/CUDLibraryBin", dataforUpdate)
            .then(function (msg) {
              $scope.msg1 = msg.data;
              if ($scope.msg1 == true) {
                swal({
                  text: "Library Bin Updated Successfully",
                  imageUrl: "assets/img/check.png",
                  showCloseButton: true,
                  width: 300,
                  height: 200,
                });
                $scope.getgrid();
              } else if ($scope.msg1 == false) {
                swal({
                  text: "Record Not Updated. ",
                  imageUrl: "assets/img/close.png",
                  showCloseButton: true,
                  width: 300,
                  height: 200,
                });
              } else {
                swal("Error-" + $scope.msg1);
              }
            });
          dataforUpdate = [];
          $scope.table = true;
          $scope.display = false;
          $scope.searchText = "";
        }
      };

      // Data DELETE RECORD
      $scope.CheckAllChecked = function () {
        main = document.getElementById("mainchk");
        if (main.checked == true) {
          for (var i = 0; i < $scope.filteredTodos.length; i++) {
            var v = document.getElementById(
              $scope.filteredTodos[i].sims_library_bin_desc +
                $scope.filteredTodos[i].sims_library_bin_code +
                i
            );
            v.checked = true;
            $("tr").addClass("row_selected");
          }
        } else {
          for (var i = 0; i < $scope.filteredTodos.length; i++) {
            var v = document.getElementById(
              $scope.filteredTodos[i].sims_library_bin_desc +
                $scope.filteredTodos[i].sims_library_bin_code +
                i
            );
            v.checked = false;
            main.checked = false;
            $scope.row1 = "";
            $("tr").removeClass("row_selected");
          }
        }
      };

      $scope.checkonebyonedelete = function () {
        $("input[type='checkbox']").change(function (e) {
          if ($(this).is(":checked")) {
            $(this).closest("tr").addClass("row_selected");
            $scope.color = "#edefef";
          } else {
            $(this).closest("tr").removeClass("row_selected");
            $scope.color = "#edefef";
          }
        });

        main = document.getElementById("mainchk");
        if (main.checked == true) {
          main.checked = false;
          $scope.color = "#edefef";
          $scope.row1 = "";
        }
      };

      $scope.OkDelete = function () {
        debugger;
        deletefin = [];
        $scope.flag = false;
        $scope.searchText = "";
        for (var i = 0; i < $scope.filteredTodos.length; i++) {
          var v = document.getElementById(
            $scope.filteredTodos[i].sims_library_bin_desc +
              $scope.filteredTodos[i].sims_library_bin_code +
              i
          );
          if (v.checked == true) {
            $scope.flag = true;
            var deletemodulecode = {
              sims_library_bin_code:
                $scope.filteredTodos[i].sims_library_bin_code,
              sims_library_bin_desc:
                $scope.filteredTodos[i].sims_library_bin_desc,
              opr: "D",
            };
            deletefin.push(deletemodulecode);
          }
        }
        if ($scope.flag) {
          swal({
            title: "",
            text: "Are you sure you want to Delete?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            width: 380,
            cancelButtonText: "No",
          }).then(function (isConfirm) {
            if (isConfirm) {
              debugger;
              $http
                .post(ENV.apiUrl + "api/LibraryBin/CUDLibraryBin", deletefin)
                .then(function (msg) {
                  $scope.msg1 = msg.data;
                  if ($scope.msg1 == true) {
                    swal({
                      text: "Library Bin Deleted Successfully",
                      imageUrl: "assets/img/check.png",
                      showCloseButton: true,
                      width: 380,
                    }).then(function (isConfirm) {
                      if (isConfirm) {
                        $scope.getgrid();
                        main = document.getElementById("mainchk");
                        if (main.checked == true) {
                          main.checked = false;
                        }

                        $scope.CheckAllChecked();
                      }
                      $scope.currentPage = true;
                    });
                  } else if ($scope.msg1 == false) {
                    swal({
                      text: "Record Not Deleted. ",
                      imageUrl: "assets/img/close.png",
                      showCloseButton: true,
                      width: 380,
                    }).then(function (isConfirm) {
                      if (isConfirm) {
                        $scope.getgrid();
                        main.checked = false;
                        $("tr").removeClass("row_selected");
                      }
                    });
                  } else {
                    swal("Error-" + $scope.msg1);
                  }
                });
              deletefin = [];
            } else {
              for (var i = 0; i < $scope.filteredTodos.length; i++) {
                var v = document.getElementById(
                  $scope.filteredTodos[i].sims_library_bin_desc +
                    $scope.filteredTodos[i].sims_library_bin_code +
                    i
                );
                if (v.checked == true) {
                  v.checked = false;
                  main.checked = false;
                  $("tr").removeClass("row_selected");
                }
              }
            }
          });
        } else {
          swal({
            text: "Please Select Atleast One Record",
            imageUrl: "assets/img/notification-alert.png",
            showCloseButton: true,
            width: 380,
          });
        }
        $scope.currentPage = true;
      };

      $scope.getgrid = function () {
        $http
          .get(ENV.apiUrl + "api/LibraryBin/GetSims_LibraryBin")
          .then(function (res1) {
            $scope.CreDiv = res1.data;
            $scope.totalItems = $scope.CreDiv.length;
            $scope.todos = $scope.CreDiv;
            $scope.makeTodos();
          });
      };
    },
  ]);
})();
