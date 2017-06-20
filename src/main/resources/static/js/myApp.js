var app=angular.module("myBanqueApp",[]);
app.controller("myBanqueController", function($scope,$http) {
	
	$scope.compte=null;
	$scope.codeCompte=null;
	$scope.operation={type:"versement",montant:0,cpte2:null};
	$scope.pageOperations=[];
	$scope.pageCourante=0;
	$scope.pageSize=5;
	$scope.pages=[];
	$scope.errorMessage=null;
	$scope.chargerCompte=function(){
		$scope.pageCourante=0;
		$http.get("/comptes/"+$scope.codeCompte)
		.then(function(response) {
			$scope.compte=response.data;
			$scope.chargerOperations();
		},
		function(response){
			$scope.errorMessage=response.data.message;
			$scope.compte=null;
			//$scope.loadOperations();
		});
	};
	$scope.chargerOperations=function(){
		$scope.errorMessage=null;
		$http.get("/operations?codeCompte="+$scope.codeCompte+"&page="+$scope.pageCourante+"&size="+$scope.pageSize)
		.then(function(response) {
			$scope.pageOperations=response.data;
			$scope.pages=new Array(response.data.totalPages)
		});
	};
	$scope.goToPage=function(p){
		$scope.pageCourante=p;
		$scope.chargerOperations();
	};
	$scope.saveOperation=function(){
		var params="";
		if($scope.operation.type=='virement'){
			params="cpte1="+$scope.codeCompte+"&cpte2="+$scope.operation.cpte2+"&montant="+$scope.operation.montant+"&codeEmp=1";
		}else{
			params="code="+$scope.codeCompte+"&montant="+$scope.operation.montant+"&codeEmp=1";
		}
		
		$http({
			method	: 'PUT',
			url		: $scope.operation.type,
			data	: params,
			headers	: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.then(function(response){
			$scope.chargerCompte();
			//$scope.loadOperations();
		},
		function(response){
			console.log(response.data.message);
			$scope.errorMessage=response.data.message;
			//$scope.loadOperations();
		});
	};
});