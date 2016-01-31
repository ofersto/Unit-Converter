storage = localStorage

getKeyByValue = (obj, value) ->
	for key in Object.keys(obj)
		if obj[key] == value
			return key
	undefined

app = angular.module "unitConverter", []
app.controller "mainController", ($scope) ->
	if storage.units
		units = storage.units
		$scope.units = JSON.parse units
	else
		$scope.units =
			"Distance":
				"Kilometer": 1000
				"Meter": 1
				"Centimeter": 0.01
				"Milimeter": 0.001
				"Mile": 1609.34
				"Inch": 0.0254
				"Yard": 0.9144
				"Foot": 0.3048
				"Nautical Mile": 1852

			"Mass": 
				"Ton": 1000000
				"Kilogram": 1000
				"Gram": 1
				"Miligram": 0.001
				"US ton": 907185
				"Stone": 6350.29
				"Pound": 453.592
				"Ounce": 28.3495
		storage.units = JSON.stringify($scope.units)
	if storage.value
		$scope.value = Number(storage.value)
	else
		$scope.value = 1

	if storage.type
		$scope.type = storage.type
	else
		$scope.type = "Distance"

	if storage.from
		$scope.from = storage.from
	else
		$scope.from = Object.keys($scope.units[$scope.type])[0]

	if storage.to
		$scope.to = storage.to
	else
		$scope.to = Object.keys($scope.units[$scope.type])[1]

	getCurrData = ->
		now = new Date()
		d = now.getDate()
		m = now.getMonth() + 1
		y = now.getFullYear()
		if d < 10
			d = '0' + d
		if m < 10
			m = '0' + m
		nowStr = y + "-" + m + "-" + d
		if storage.currDate != nowStr
			console.log "get currencies data"
			$.getJSON "http://api.fixer.io/latest", (data) ->
				if not data.date == nowStr
					obj = data.rates
					obj[data.base] = 1
					Object.keys(obj).sort()
					$scope.units["Currency"] = obj
					storage.units = JSON.stringify $scope.units
					storage.currDate = data.date
					$("select[name='type']").trigger("change")
				$scope.currStatus = "Currencies data are loaded successfully"
			.fail ->
				$scope.currStatus = "Sorry, but we couldn't get the currencies data"
		else
			$scope.currStatus = "The currencies data is already loaded!"
	getCurrData()
	$scope.Utils = 
		keys: Object.keys
		round: (n, dec) ->
			if n
				Number(n).toFixed(dec)
			else
				$scope.convert()
	$scope.typeChanged = ->
		storage.type = $scope.type
		$scope.value = 1
		$scope.from = Object.keys($scope.units[$scope.type])[0]
		$scope.to = Object.keys($scope.units[$scope.type])[1]
		$scope.convert()
		undefined
	$scope.convert = ->
		from = $scope.units[$scope.type][$scope.from]
		to = $scope.units[$scope.type][$scope.to]
		storage.value = $scope.value
		storage.from = getKeyByValue($scope.units[$scope.type], from)
		storage.to = getKeyByValue($scope.units[$scope.type], to)
		if $scope.type != "Currency"
			result = Number($scope.value) * from / to
		else
			result = Number($scope.value) / from * to
		$scope.result = result
		undefined
	undefined

$ ->
	$("select").material_select()
	$("select[name='type']").on "change", ->
		$("select").material_select()