/* სახელისა და ჯგუფის ნორმალიზაცია.
   სერვერი თავად ითვლის გასაღებებს (key) - კლიენტის მონაცემებს არ ვენდობით. */

// სახელი და გვარი: ზედმეტი ჰარები/უხილავი სიმბოლოები იჭრება, მინიმუმ ორი სიტყვა.
export function cleanName(raw) {
  if (typeof raw !== 'string') return null;
  const s = raw
    .normalize('NFC')
    .replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (s.length < 5 || s.length > 60 || s.split(' ').length < 2) return null;
  return s;
}

// ერთი და იგივე ადამიანის სხვადასხვა ჩანაწერი ერთ გასაღებად იქცევა:
// დიდი/პატარა ასოები და სიტყვების რიგი არ ითვლება ("Beridze  Giorgi" = "giorgi beridze").
export function nameKey(clean) {
  return clean
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(' ')
    .sort()
    .join(' ');
}

// ჯგუფი: "se-621-6", "SE 621 6", "Se-621-6" -> label "SE-621-6"; "jp_539_4" -> label "JP_539_4".
// key-ში გამყოფები (- _ .) ერთნაირია, ამიტომ "JP_539_4" და "JP-539-4" ერთი ჯგუფია.
// აუცილებლად ვაჯგუფებთ მხოლოდ ლათინურ ასოებს; ქართული ასოები არ იცვლება.
const GROUP_RE = /^[\p{L}\p{N}]+(?:[-_.][\p{L}\p{N}]+)*$/u;

export function normalizeGroup(raw) {
  if (typeof raw !== 'string') return null;
  let s = raw.normalize('NFKC').trim();
  s = s.replace(/\s*([-_.])\s*/g, '$1').replace(/\s+/g, '-').replace(/[-_.]{2,}/g, m => m[0]);
  const label = s.replace(/[a-z]/g, c => c.toUpperCase());
  if (label.length < 2 || label.length > 24 || !GROUP_RE.test(label)) return null;
  return { label, key: label.replace(/[-_.]+/g, '-') };
}
