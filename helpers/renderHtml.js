export default function renderHtml(html){
    const span = document.createElement('span');
    span.innerHTML = html;
    const text = span.innerText;
    return text;
}
