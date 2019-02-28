/*
* base/frontend/paper_lantern/jetbackup/controllers/fileManager.js
*
* JetBackup @ package
* Created By Idan Ben-Ezra
*
* Copyrights @ JetApps
* https://www.jetapps.com
*
**/

/* global define: false, PAGE: false */

define(
	[
		"lodash",
		"angular",
		"cjt/util/locale",
		"uiBootstrap",
		"ngRoute",
		"cjt/directives/actionButtonDirective",
		"cjt/directives/loadingPanel",
		"cjt/directives/toggleSortDirective",
		"cjt/directives/searchDirective",
		"cjt/directives/pageSizeDirective",
		"cjt/filters/startFromFilter",
		"cjt/decorators/paginationDecorator"
	],
	function(_, angular, LOCALE) {

		var app;
		try {
			app = angular.module("cpanel.jetbackup");
		}
		catch(e) {
			app = angular.module("cpanel.jetbackup", []);
		}

		app.controller("fileManager",
			["$rootScope", "$scope", "$interval", "$timeout", "jetapi", "growl", "$window", "$routeParams", "$location",
				function($rootScope, $scope, $interval, $timeout, jetapi, growl, $window, $routeParams, $location) {

					$scope.backupId = $routeParams.id;
					$scope.files = [];
					$scope.loadingFiles = false;
					$scope.LOCALE = LOCALE;
					$scope.currentPath = '';
					$scope.breadcrumbs = [];
					$scope.filesIndex = {};
					$scope.actionStatus = undefined;
					$scope.actionModule = undefined;
					$scope.config = PAGE.config;
					$scope.restoringBackup = false;
					$scope.downloadingBackup = false;
					$scope.downloads = [];
					$scope.restores = [];
					$scope.sortedDownloadList = {};
					$scope.sortedRestoreList = {};

					$scope.clearStatus = function() {
						$scope.actionStatus = undefined;
					};

					$scope.cancelAction = function() {
						$scope.actionStatus = undefined;
						$scope.actionModule = undefined;
					};

					$scope.changeView = function(view){
						$location.path(view); // path not hash
					};

					$scope.onClickRestore = function() {
						var selected = getSelected();

						if(!selected.length)
						{
							$scope.actionStatus = {
								message: "Please select files to restore",
								type: "danger",
								closeable: true,
								ttl: 10000
							};
							return;
						}

						$scope.actionModule = ($scope.actionModule === 'restore') ? undefined : 'restore';
					};

					$scope.onClickRestoreConfirm = function() {

						$scope.restoringBackup = true;
						$scope.actionStatus = undefined;

						var selected = JSON.stringify(getSelected());

						return jetapi.addQueueRestore({ _id: $scope.backupId, files: selected }).then(function(response) {

							if(response.status)
							{
								var text = '';
								if(response.data.status === 100) text = LOCALE.maketext("Restore Completed");
								else if(response.data.status > 100) text = LOCALE.maketext("Restore Failed");
								else text = LOCALE.maketext("Restore in Progress");

								var item = {
									_id: response.data._id,
									ready: response.data.status >= 100,
									status: response.data.status,
									created: response.data.created,
									text: text
								};
								$scope.restores.push(item);
								$scope.sortedRestoreList[response.data._id] = item;
							}

							$scope.checkStatus();

							$scope.actionStatus = {
								message: LOCALE.maketext(response.messages[0].content),
								type: response.status ? "success" : "danger",
								closeable: true,
								ttl: 10000
							};

							$scope.restoringBackup = false;
							$scope.actionModule = undefined;
							$scope.uncheckAll();
						}, function(error) {
							$scope.actionStatus = { type: "danger", message: error };
							$scope.restoringBackup = false;
						});
					};

					$scope.onClickDownload = function() {

						var selected = getSelected();

						if(!selected.length)
						{
							$scope.actionStatus = {
								message: "Please select files to download",
								type: "danger",
								closeable: true,
								ttl: 10000
							};

							return;
						}

						$scope.actionModule = ($scope.actionModule === 'download') ? undefined : 'download';
					};

					$scope.onClickDownloadConfirm = function() {

						$scope.downloadingBackup = true;
						$scope.actionStatus = undefined;

						var selected = JSON.stringify(getSelected());

						return jetapi.addQueueDownload({ _id: $scope.backupId, files: selected }).then(function(response) {

							if(response.status)
							{
								var item = {
									queue_id: response.data._id,
									ready: response.data.ready,
									filename: response.data.filename
								};
								$scope.downloads.push(item);
								$scope.sortedDownloadList[response.data._id] = item;
							}

							$scope.checkStatus();

							$scope.actionStatus = {
								message: LOCALE.maketext(response.messages[0].content),
								type: response.status ? "success" : "danger",
								closeable: true,
								ttl: 10000
							};

							$scope.downloadingBackup = false;
							$scope.actionModule = undefined;
							$scope.uncheckAll();
						}, function(error) {
							$scope.actionStatus = { type: "danger", message: error };
							$scope.downloadingBackup = false;
						});
					};

					$scope.isConditionsAgreed = function() {

						for(var i in $scope.config.restore_conditions)
						{
							if($scope.config.restore_conditions[i].type !== 0 && $scope.config.restore_conditions[i].type !== $scope.backupType) continue;
							if(!$scope.config.restore_conditions[i].checked) return true
						}

						return false;
					};

					var getSelected = function() {

						var selected = [];

						for(var i in $scope.filesIndex)
						{
							for(var j in $scope.filesIndex[i].data.files)
							{
								if($scope.filesIndex[i].data.files[j] != null && $scope.filesIndex[i].data.files[j].checked !== undefined && $scope.filesIndex[i].data.files[j].checked)
								{
									selected.push($scope.filesIndex[i].data.files[j].path);
								}
							}
						}

						return selected;
					};

					$scope.canPerformAction = function () {

						for(var i in $scope.filesIndex)
						{
							for(var j in $scope.filesIndex[i].data.files)
							{
								if($scope.filesIndex[i].data.files[j] != null && $scope.filesIndex[i].data.files[j].checked !== undefined && $scope.filesIndex[i].data.files[j].checked)
								{
									return false;
								}
							}
						}

						return true;
					};

					$scope.isDisabled = function() {
						var file = this.file.parent;
						while(!file.checked && file.parent) file = file.parent;
						return file.checked;
					};

					$scope.isChecked= function() {
						var file = this.file;
						while(!file.checked && file.parent) file = file.parent;
						return file.checked;
					};

					$scope.calculateInput = function(value) {

						if(value === undefined)
						{
							var file = this.file;
							while(!file.checked && file.parent) file = file.parent;
							return file.checked;
						}

						this.file.checked = value;
					};

					var manageBreadcrumbs = function(file) {
						if(file.path === '/') file.name = '/backup-root';
						$scope.breadcrumbs.unshift(file);
						if(file.parent !== undefined) manageBreadcrumbs(file.parent);
					};

					var handleResponse = function(response, file) {
						angular.element("#FilesList").css({ minHeight: "" });
						$scope.filesIndex[file.path] = response;
						$scope.files = response.data.files;
						$scope.loadingFiles = false;
					};

					$scope.fetch = function(file) {

						if(file.path === undefined) file.path = '/';

						$scope.loadingFiles = true;
						$scope.files = [];

						$scope.breadcrumbs = [];
						manageBreadcrumbs(file);

						var container = angular.element("#FilesList");

						if( container && container[0] ) {
							container.css({ minHeight: $window.getComputedStyle(container[0]).height });
						}

						if($scope.filesIndex[file.path] !== undefined)
						{
							handleResponse($scope.filesIndex[file.path], file);
							return;
						}

						apiParams = {};
						apiParams['_id'] = $scope.backupId;
						apiParams['path'] = file.path;

						var apiPromise = jetapi.fileManager(apiParams);
						$scope.fetchPromise = apiPromise;

						apiPromise.then(
							function(response) {

								// We only want to actually process the response if it's the last request we sent
								if( $scope.fetchPromise !== apiPromise ) {
									return;
								}

								for(var i = 0; i < response.data.files.length; i++)
								{
									response.data.files[i].path = file.path + (file.path === '/' ? '' : '/') + response.data.files[i].name;
									response.data.files[i].parent = file;
								}

								handleResponse(response, file);
							},
							function(error) {
								growl.error(error);
								$scope.loadingFiles = false;
							}
						);

					};

					$scope.uncheckAll = function () {

						for(var i in $scope.filesIndex)
						{
							for(var j in $scope.filesIndex[i].data.files)
							{
								if($scope.filesIndex[i].data.files[j] != null && $scope.filesIndex[i].data.files[j].checked !== undefined && $scope.filesIndex[i].data.files[j].checked)
								{
									$scope.filesIndex[i].data.files[j].checked = false;
								}
							}
						}

					};

					$scope.directDownload = function(filename) {

						var match = window.location.pathname.match(/^\/cpsess[^\/]+\//);
						if(match[0] !== undefined)
						{
							window.location = match[0] + 'download?file=.jbm/downloads/' + filename;
						}
					};

					$scope.getDownloads = function () {

						$scope.loadingDownloads = true;
						$scope.downloads = [];

						return jetapi.getBackupDownloads({ _id: $scope.backupId }).then(function(response) {
							if(response.data) $scope.downloads = response.data.downloads;
							$scope.loadingDownloads = false;
							$scope.checkStatus();
						}, function(error) {
							growl.error(error);
							$scope.loadingDownloads = false;
						});
					};

					$scope.getRestores = function () {

						$scope.loadingRestores = true;
						$scope.restores = [];

						return jetapi.listQueueItems().then(function(response) {

							for(var i in response.data.queue)
							{
								var data = response.data.queue[i];
								if(data.type !== 1) continue;

								var text = '';
								if(data.status === 100) text = LOCALE.maketext("Restore Completed");
								else if(data.status > 100) text = LOCALE.maketext("Restore Failed");
								else text = LOCALE.maketext("Restore in Progress");

								var item = {
									_id: data._id,
									ready: data.status >= 100,
									status: data.status,
									created: data.created,
									text: text
								};

								$scope.restores.push(item);
							}

							$scope.loadingRestores = false;
							$scope.checkStatus();
						}, function(error) {
							growl.error(error);
							$scope.loadingRestores = false;
						});
					};

					var statusInterval;

					$scope.checkStatus = function () {

						if(angular.isDefined(statusInterval)) return;

						var runCheckStatus = false;
						$scope.sortedDownloadList = {};
						$scope.sortedRestoreList = {};

						for(var i in $scope.downloads)
						{
							if(!$scope.downloads[i].ready)
							{
								$scope.sortedDownloadList[$scope.downloads[i].queue_id] = $scope.downloads[i];
								runCheckStatus = true;
							}
						}

						for(var i in $scope.restores)
						{
							if(!$scope.restores[i].ready)
							{
								$scope.sortedRestoreList[$scope.restores[i]._id] = $scope.restores[i];
								runCheckStatus = true;
							}
						}

						if(!runCheckStatus) return;

						statusInterval = $interval(function() {

							return jetapi.listQueueItems().then(function(response) {

									var data = response.data.queue;
									var queued = 0;

									for(var i in data)
									{
										var _id = data[i]._id;

										if(data[i].status >= 100)
										{
											switch(data[i].type)
											{
												// Restore
												case 1:
													if($scope.sortedRestoreList[_id] === undefined) continue;
													$scope.sortedRestoreList[_id].status = data[i].status;
													$scope.sortedRestoreList[_id].ready = data[i].status >= 100;

													var text = '';
													if(data[i].status === 100) text = LOCALE.maketext("Restore Completed");
													else if(data[i].status > 100) text = LOCALE.maketext("Restore Failed");
													else text = LOCALE.maketext("Restore in Progress");

													$scope.sortedRestoreList[_id].text = text;
													break;

												// Download
												case 2:
													if($scope.sortedDownloadList[_id] === undefined) continue;
													if(data[i].status === 100)
													{
														$scope.sortedDownloadList[_id].filename = data[i].filename;
														$scope.sortedDownloadList[_id].ready = true;
													}
													else
													{
														$scope.sortedDownloadList[_id].filename = 'Failed to Download';
													}
													break;
											}
										}
										else
										{
											queued++;
										}
									}

									if(!queued)
									{
										$interval.cancel(statusInterval);
										statusInterval=undefined;
									}
								},
								function(error) {
									growl.error(error);
								}
							);
						}, 5000);
					};

					$scope.init = function () {
						$scope.getDownloads();
						$scope.getRestores();
						$scope.fetch({path: '/'});
					};

					$timeout($scope.init());
				}]
		);

	}
);