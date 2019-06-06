document.addEventListener("DOMContentLoaded", function (event) {
	readdata();
	index_putmanga(allmanga);
	numGood = parseInt(localStorage.getItem("number_good"));
	if (isNaN(numGood)) numGood = 0;
	good_page_putmanga(numGood);
	desires_putmanga();
	basket_goods();
	if ($(document).height() <= $(window).height())
	$("footer").addClass("fixed-bottom");
});

var accounts = [];
var currentaccount;
var numGood;

function allmanga (manga) {
	return true;
}

$(".button_like").click(function () {
	if (currentaccount === null) $("#modalLogin").modal("show");
	else {
		if ($(this).hasClass("btn-secondary")) {
			$(this).addClass("btn-danger");
			$(this).removeClass("btn-secondary");
			currentaccount.likes.push(numGood);
		}
		else {
			$(this).removeClass("btn-danger");
			$(this).addClass("btn-secondary");
			for (var i = 0; i < currentaccount.likes.length; i++)
				if (currentaccount.likes[i] === numGood) currentaccount.likes.splice(i, 1);
		}
	}
	writedata();
});

$(".button_basket").click(function () {
	if (currentaccount === null) $("#modalLogin").modal("show");
	else {
		if ($(this).hasClass("btn-dark")) {
			$(this).addClass("btn-info");
			$(this).removeClass("btn-dark");
			currentaccount.basket.push(numGood);
		}
		else {
			$(this).removeClass("btn-info");
			$(this).addClass("btn-dark");
			for (var i = 0; i < currentaccount.basket.length; i++)
				if (currentaccount.basket[i] === numGood) currentaccount.basket.splice(i, 1);
		}
	}
	writedata();
});


$(".registration_button").click(function () {
	var account = {
		login: "",
		password: "",
		basket: [],
		likes: []
	}

	account.login = $(".uname_registration").val();
	account.password = $(".password_registration").val();

	if (account.login !== "" && account.password !== "") {
		if (!employment(account)) accounts.push(account);
		else {
			$(".uname_registration").next(".invalid-feedback").html("Аккаунт с таким логином уже существует")
			$(".uname_registration").addClass("is-invalid");
			return;
		}
	}
	else {
		$(".uname_registration").next(".invalid-feedback").html("Логин не должен содержать пробелы");
		$(".uname_registration").addClass("is-invalid");
		return;
	}

	writedata();

	_login(account.login, account.password);

});

function employment(account) {
	for (var i = 0; i < accounts.length; i++)
		if (account.login === accounts[i].login) return true;
	return false;
}

$(".uname_button").click(function () {
	var login = $(".uname_login").val();
	var password = $(".password_login").val();

	if (!_login(login, password)) {
		$(".password_login").next(".invalid-feedback").html("Проверьте правильность пароля и попробуйте снова");
		$(".password_login").addClass("is-invalid");
	}
	else location.reload();
});

function _login(login, password) {
	var num = checkCorrection(login, password);
	if (num !== -1) {
		currentaccount = accounts[num];
		$("#modalLogin").modal("hide");
		$(".account_login").removeClass("display-none").find(".account_login_text").html(currentaccount.login);
		$(".login_buttom").addClass("display-none");
		$(".basket").removeClass("display-none");
		$(".desires").removeClass("display-none");
		writedata();
		return true;
	}
	return false;
};

//проверяет корректность данных, и в случае успеха возвращает номер аккаунта в масиве
function checkCorrection(login, password) {
	for (var i = 0; i < accounts.length; i++)
		if (login === accounts[i].login && password === accounts[i].password) return i;
	return -1;
};

$('.password_login').on('input', resetError);
$('.uname_registration').on('input', resetError);


function resetError() {
	$(this).removeClass("is-invalid");
};

$(".exit_button").click(function () {
	$(".account_login").addClass("display-none");
	$(".login_buttom").removeClass("display-none");
	$(".basket").addClass("display-none");
	$(".desires").addClass("display-none");
	currentaccount = null;
	writedata();
	window.location.href = "index.html";
});

function readdata() {
	accounts = JSON.parse(localStorage.getItem("accounts"));
	currentaccount = JSON.parse(localStorage.getItem("currentaccount"));
	if (accounts === null) accounts = [];
	if (currentaccount !== null) _login(currentaccount.login, currentaccount.password);
}

function writedata() {
	localStorage.setItem("accounts", JSON.stringify(accounts));
	localStorage.setItem("currentaccount", JSON.stringify(currentaccount));
}


function goToGood(num) {
	localStorage.setItem("number_good", num);
	window.location.href = "good_page.html";
};

function basket_goods() {
	if (currentaccount.basket.length === 0) $(".basket_goods").html('<div style="height: 300px; line-height: 300px; width: 100%" class="text-center">Здесь пока ничего нет</div>');
	var totalcost = 0;
	for (var i = 0; i < currentaccount.basket.length; i++) {
		var index = currentaccount.basket[i];
		totalcost += manga[index].cost;
		$(".basket_goods").append(
`
<div class="good card col-12">
<div class="container">
	<div class="row">
		<img class="card-img-left card-img-long" src="` + manga[index].path[0] + `" alt="Card image cap">
		<div class="card-body">
			<h5 class="card-title">` + manga[index].name + `</h5>
			<p class="card-text">
				<span class="gray">Автор: </span>
				` + manga[index].author + `<br>
				<span class="gray">Жанр: </span>
				` + manga[index].genre + `<br>
				<span class="gray">Томов в серии: </span>
				` + manga[index].numtoms + `<br>
				<span class="gray">Количество страниц: </span>
				` + manga[index].numpages + `<br>
				<span class="gray">Вес: </span>
				` + manga[index].weight + ` гр.<br>
			</p>
			<div class="card-long-buttons">
				Цена: ` + manga[index].cost + ` ₽
			</div>
		</div>
	</div>
</div>
</div>
`
		);
	}
	$('.totalcost').html(totalcost);
}

function desires_putmanga() {
	if (currentaccount.likes.length === 0) $(".desires_goods").html('<div style="height: 300px; line-height: 300px; width: 100%" class="text-center">Здесь пока ничего нет</div>');
	for (var i = 0; i < currentaccount.likes.length; i++) {
		var index = currentaccount.likes[i];
		$(".desires_goods").append(
`
<div class="good card col-12">
<div class="container">
	<div class="row">
		<img class="card-img-left card-img-long" src="` + manga[index].path[0] + `" alt="Card image cap">
		<div class="card-body">
			<h5 class="card-title">` + manga[index].name + `</h5>
			<p class="card-text">
				<span class="gray">Автор: </span>
				` + manga[index].author + `<br>
				<span class="gray">Жанр: </span>
				` + manga[index].genre + `<br>
				<span class="gray">Томов в серии: </span>
				` + manga[index].numtoms + `<br>
				<span class="gray">Количество страниц: </span>
				` + manga[index].numpages + `<br>
				<span class="gray">Вес: </span>
				` + manga[index].weight + ` гр.<br>
			</p>
			<div class="card-long-buttons">
				<button type="button" class="btn btn-success">Купить за ` + manga[index].cost + ` ₽</button>
			</div>
		</div>
	</div>
</div>
</div>
`
		);
	}
}


function good_page_putmanga(num) {
	$(".good_page_good").append('<div class="good col-12"><div class="container"><div class="row"><div id="carouselExampleControls" class="carousel slide col-3" data-ride="carousel"><div class="carousel-inner"><div class="carousel-item active"><img class="d-block w-100" src="' + manga[num].path[0] + '" alt="Первый слайд"></div><div class="carousel-item"><img class="d-block w-100" src="' + manga[num].path[1] + '" alt="Второй слайд"></div><div class="carousel-item"><img class="d-block w-100" src="' + manga[num].path[2] + '" alt="Третий слайд"></div></div><a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Предыдушая</span></a><a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Следующая</span></a></div><div class="card-body col-9"><h5 class="card-title">' + manga[num].name + '</h5><p class="card-text"><span class="gray">Автор: </span>' + manga[num].author + '<br><span class="gray">Жанр: </span>' + manga[num].genre + '<br><span class="gray">Томов в серии: </span>' + manga[num].numtoms + '<br><span class="gray">Количество страниц: </span>' + manga[num].numpages + '<br><span class="gray">Вес: </span>' + manga[num].weight + ' гр.<br><br>' + manga[num].description + '</p></div></div></div></div>')
	$(".good_button_buy").html("Купить за " + manga[num].cost + "₽");
	$(".good_namemanga").html(manga[num].name.toUpperCase());
	if (currentaccount !== null) {
		for (var i = 0; i < currentaccount.likes.length; i++){
			if (currentaccount.likes[i] === num) {
				$(".button_like").addClass("btn-danger");
				$(".button_like").removeClass("btn-secondary");
			}
		}
		for (var i = 0; i < currentaccount.basket.length; i++){
			if (currentaccount.basket[i] === num) {
				$(".button_basket").addClass("btn-info");
				$(".button_basket").removeClass("btn-dark");
			}
		}
	}
}

var req;
$(".button_search").click(function() {
	req = $(".search_input").val();
	index_putmanga(compsearch);
});

function compsearch(manga) {
	return manga.name.toUpperCase().indexOf(req.toUpperCase()) >= 0;
}


function index_putmanga(check) {
	$(".index_goods").html("");
	for (var i = 0; i < manga.length; i++)
	if (check(manga[i]))
		$(".index_goods").append(
			'<div class="col-12 col-md-6 col-lg-4 col-xl-3"><a onclick="goToGood(' + i + ')" style="cursor: pointer"><div class="shadowh good card"><img class=" card-img-top" src="' + manga[i].path[0] + '" alt="Card image cap"><div class="card-body text-center"><h5 class="card-title">' + manga[i].name + '</h5><p class="card-text">Книга ' + manga[i].tom + '</p><p class="card-cost">' + manga[i].cost + ' ₽</p></div></div></a></div>'
		);
};

var manga = [
	{
		name: "one-punch man",
		author: "One, Юскэ Мурата",
		genre: "Боевик, Боевые искусства, Комедия, Приключения, Фантастика",
		tom: 1,
		numtoms: 14,
		numpages: 400,
		weight: 500,
		cost: 539,
		date: 2009,
		description: " Главный герой — Сайтама — обрёл настолько невероятную силу, что ему трудно найти достойного соперника. Ведь любого бойца он отправляет в нокаут с одного удара!",
		path: [
			"img/goods/good_1/good_img_1.png",
			"img/goods/good_1/good_img_2.png",
			"img/goods/good_1/good_img_3.png"
		]
	},
	{
		name: "Восхождение Героя Щита",
		author: "Кю Айя, Юсаги Анэко",
		genre: "Комедия, Приключения, Романтика, Сёнэн, Фэнтези",
		tom: 9,
		numtoms: 9,
		numpages: 164,
		weight: 220,
		cost: 330,
		date: 2017,
		description: "Конфликт с Церковью Трех Героев остался позади, а Наофуми и Герои Копья, Меча и Лука наконец-то нашли общий язык. Но миру по-прежнему угрожают волны демонов - а значит, надо постараться стать сильнее. Наофуми и его друзья отправляются на остров Каль-Мира, известное место прокачки, где раз в десять лет происходит явление, позволяющее получать больше опыта. Там им предстоит встретиться с монстрами всех мастей, а также обрести новых друзей... или все же врагов?",
		path: [
			"img/goods/good_2/good_img_1.png",
			"img/goods/good_2/good_img_2.png",
			"img/goods/good_2/good_img_3.png"
		]
	},
	{
		name: "Созданный в Бездне",
		author: "Акихито Цукуси",
		genre: "Приключения, Фэнтези",
		tom: 2,
		numtoms: 7,
		numpages: 160,
		weight: 200,
		cost: 350,
		date: 2012,
		description: "Аэростат, поднявшийся из глубин Бездны, доставил на поверхность белый свиток и заметки, написанные матерью Рико. Среди них было и письмо дочери, а в нём – только одна строчка: «Жду тебя на дне Нараку». Ведомая непреодолимым желанием увидеть маму, Рико сбегает из приюта «Белчеро». Рэг вызывается ей помочь, зная, что вернуть свои воспоминания он сможет только вернувшись в Бездну. Юные искатели отправляются в безвозвратное путешествие, понимая, что больше никогда не увидят своих друзей. Впереди их ждёт Перевёрнутый лес...",
		path: [
			"img/goods/good_3/good_img_1.png",
			"img/goods/good_3/good_img_2.png",
			"img/goods/good_3/good_img_3.png"
		]
	},
	{
		name: "Fairy Tail",
		author: "Хиро Масима",
		genre: "Комедия, Приключения, Сёнэн, Фэнтези",
		tom: 4,
		numtoms: 63,
		numpages: 194,
		weight: 260,
		cost: 385,
		date: 2007,
		description: "Оказывается, на втором этаже здания гильдии «Хвост феи» есть еще одна доска заявок — для особо опасных поручений, которые называются заданиями ранга S. К ним допускают лишь пятерых членов гильдии, но одержимые любопытством Нацу, Люси и Хэппи берут одну из таких заявок без разрешения. Задание приводит их на проклятый остров, жители которого превращаются в демонов и теряют рассудок под воздействием лунной магии. Поручение кажется невыполнимым: наших героев просят снять чары, а точнее - «уничтожить луну»...",
		path: [
			"img/goods/good_4/good_img_1.png",
			"img/goods/good_4/good_img_2.png",
			"img/goods/good_4/good_img_3.png"
		]
	},
	{
		name: "Нелюдь",
		author: "Гамон Сакураи",
		genre: "Приключения, сэйнэн, Ужасы, Фантастика",
		tom: 8,
		numtoms: 13,
		numpages: 196,
		weight: 265,
		cost: 330,
		date: 2015,
		description: 'В здании компании "Безопасность Forge" продолжает разворачиваться бой, который для кого-то - увлекательная игра, а для кого-то - противостояние не на жизнь, а на смерть. Кажется, что Кэй Нагаи продумал все до мелочей, но Сато, как известно, тоже не лыком шит...',
		path: [
			"img/goods/good_5/good_img_1.png",
			"img/goods/good_5/good_img_2.png",
			"img/goods/good_5/good_img_3.png"
		]
	},
	{
		name: "Волчица и пряности",
		author: "Кэйто Коумэ, Исуна Хасэкура",
		genre: "Приключения, Фэнтези",
		tom: 7,
		numtoms: 9,
		numpages: 192,
		weight: 200,
		cost: 420,
		date: 2006,
		description: 'В поисках дороги в Йойс, Лоуренс и Холо приезжают в небольшую деревню Терэо. Где-то в её окрестностях расположен тайный монастырь, в котором хранятся книги с древними легендами. Но уйти из этого монастыря может быть даже сложнее, чем найти его...',
		path: [
			"img/goods/good_6/good_img_1.png",
			"img/goods/good_6/good_img_2.png",
			"img/goods/good_6/good_img_3.png"
		]
	},
	{
		name: "Стальной Алхимик",
		author: "Хирому Аракава",
		genre: "Боевик, Драма, Приключения, Фантастика",
		tom: 2,
		numtoms: 27,
		numpages: 264,
		weight: 610,
		cost: 669,
		date: 2001,
		description: 'Легендарная серия манги показывает нам альтернативный 20-й век, в котором магия и алхимия идут в ногу с технологическим процессом. В центре сюжета два брата, Эдвард и Альфонс, попытка которых спасти умершую мать с помощью алхимии приводит к ужасным последствиям. У Эдварда не остается иного выбора, как вступить в армию, чтобы попытаться найти способ восстановить искалеченное тело своего брата и свое собственное.<br> Манга выходит в шикарном полиграфическом оформлении делюкс издания, на мелованной бумаге в твердом переплете с суперобложкой! В нашем издании будут цветные страницы и скетчи, которые были и внутри оригинального издания, мы сохраним даже титульную страницу на кальке!',
		path: [
			"img/goods/good_7/good_img_1.png",
			"img/goods/good_7/good_img_2.png",
			"img/goods/good_7/good_img_3.png"
		]
	},
	{
		name: "Рыцари «Сидонии»",
		author: "Цутому Нихэй",
		genre: "Драма, Меха, сэйнэн, Фантастика",
		tom: 2,
		numtoms: 15,
		numpages: 182,
		weight: 245,
		cost: 315,
		date: 2010,
		description: 'Обитатели «Сидонии» продолжают защищаться от гигантских пришельцев Гауна. Четверка лучших пилотов корабля отправляется на боевой вылет, и среди них – Нагатэ Таникадзе, которому доверили управление легендарным Стражем «Цугумори».<br> Чтобы спастись от преследования Гауна, капитан должен отдать команду совершить маневр экстренного ускорения, но это может повлечь жертвы среди населения корабля. Тем временем Нагатэ оказывается перед таким же нелегким выбором: рискую собственной жизнью, он пытается спасти девушку по имени Сидзука Хосидзиро, одного из первых друзей, которые появились у него на «Сидонии».',
		path: [
			"img/goods/good_8/good_img_1.png",
			"img/goods/good_8/good_img_2.png",
			"img/goods/good_8/good_img_3.png"
		]
	},
];