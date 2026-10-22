/* ლექტორების სია. ახალი ლექტორის დასამატებლად ჩაამატე სახელი აქ და გაუშვი `npm run deploy`.
   სიიდან ამოღებული ლექტორი სიაში აღარ ჩანს, მაგრამ მისი სტუდენტების შედეგები ბაზაში რჩება. */
export const LECTURERS = [
  'გივი ვახტანგიშვილი',
  'ლაშა კაკაშვილი',
  'ირაკლი ადამაშვილი',
  'ლანა სტინი',
  'ანი ჯიჯიაშვილი',
  'მარიამ ბეროშვილი'
];

/* ტესტები. id იგზავნება სტუდენტის გვერდიდან; max = კითხვების რაოდენობა.
   ახალი ტესტისთვის დაამატე ახალი ჩანაწერი (id-ები არასოდეს შეცვალო - შედეგები მათზეა მიბმული). */
export const QUIZZES = {
  'html-intro-4': { title: 'HTML შესავალი · ლექცია 4', max: 24 },
  'js-conditions': { title: 'JavaScript · პირობები', max: 15 },
  'js-loops': { title: 'JavaScript · ციკლები', max: 15 },
  'js-functions': { title: 'JavaScript · ფუნქციები', max: 15 },
  'js-classes': { title: 'JavaScript · კლასები', max: 15 },
  'js-dom': { title: 'JavaScript · DOM', max: 15 },
  'js-bom': { title: 'JavaScript · BOM', max: 15 },
  'js-api': { title: 'JavaScript · API (fetch)', max: 15 },
  'js-crud': { title: 'JavaScript · CRUD', max: 15 }
};
