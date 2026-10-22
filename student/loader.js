/* ირჩევს ტესტს მისამართიდან (?quiz=js-loops), ტვირთავს მის კითხვებს (quizzes/<id>.js) და მერე app.js-ს.
   ?quiz-ის გარეშე იხსნება პირველი ტესტი (HTML შესავალი) - ძველი ბმულები ისევ მუშაობს.
   ცალკე ფაილშია იმავე მიზეზით, რის გამოც კითხვები (იხ. quizzes/html-intro-4.js-ის დასაწყისი). */
(function () {
    var DEFAULT_QUIZ = 'html-intro-4';
    var id = new URLSearchParams(location.search).get('quiz') || DEFAULT_QUIZ;

    function fail(text) {
        var box = document.getElementById('loadError');
        box.textContent = text;
        box.hidden = false;
        document.getElementById('startCard').hidden = true;
    }

    if (!/^[a-z0-9-]{1,40}$/.test(id)) return fail('ტესტი ვერ მოიძებნა. გახსენი ტესტების სია და აირჩიე სწორი ბმულიდან.');

    function load(src, onload, onerror) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = onload;
        s.onerror = onerror;
        document.body.append(s);
    }

    load('quizzes/' + id + '.js', function () {
        load('app.js', null, function () { fail('გვერდის კოდი ვერ ჩაიტვირთა. სცადე გვერდის განახლება.'); });
    }, function () {
        fail('ტესტი „' + id + '“ ვერ მოიძებნა. გახსენი ტესტების სია და აირჩიე სწორი ბმულიდან.');
    });
})();
