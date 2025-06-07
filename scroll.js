(function() {
    var scrollsDone = 0;
    var totalScrollsToPerform = Math.ceil(200 / 11);
    var delayBetweenScrollsMs = 6000; // נשנה את זה בהמשך אם צריך
    var noChangeCount = 0;
    var MAX_NO_CHANGE_ATTEMPTS = 2; // אפשר לשקול להגדיל ל-7 או 10
    var lastScrollHeightOfContent = 0;
    var scrollableElement = document.querySelector('#content');

    if (!scrollableElement) {
        console.error('GistScroller: Scrollable element "#content" not found!');
        alert('שגיאה מהסקריפט הנטען: אלמנט הגלילה "#content" לא נמצא בדף.');
        return;
    }

    scrollableElement.style.outline = '3px dashed purple'; // שיניתי צבע להבדיל
    console.log('GistScroller: Attempting to start auto-scroll on #content (v_gist)...');
    alert('מתחיל גלילה אוטומטית על #content (נטען מ-Gist).\nלחץ אישור כדי להתחיל.');

    function getContentScrollHeight() {
        return scrollableElement.scrollHeight;
    }

    function performActualScroll() {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
    }

    function scrollAndLoad() {
        if (scrollsDone >= totalScrollsToPerform) {
            console.log('GistScroller: הסתיימה הגלילה (הגעה למספר גלילות רצוי). נטענו כ-' + (scrollsDone * 11) + ' מוצרים.');
            alert('הסתיימה הגלילה (מ-Gist)! (הגעה למספר גלילות רצוי). נטענו כ-' + (scrollsDone * 11) + ' מוצרים.');
            scrollableElement.style.outline = 'none';
            return;
        }

        performActualScroll();
        scrollsDone++;
        console.log('GistScroller: גלילה #' + scrollsDone + '/' + totalScrollsToPerform + ' על #content. גובה לפני טעינה: ' + lastScrollHeightOfContent);
        
        setTimeout(function() {
            var heightAfterLoadAttempt = getContentScrollHeight();
            console.log('GistScroller: גובה #content לאחר ניסיון טעינה: ' + heightAfterLoadAttempt);

            if (scrollsDone > 1 && heightAfterLoadAttempt <= lastScrollHeightOfContent) {
                noChangeCount++;
                console.warn('GistScroller: גובה #content לא השתנה. ניסיון ' + noChangeCount + '/' + MAX_NO_CHANGE_ATTEMPTS);
                if (noChangeCount >= MAX_NO_CHANGE_ATTEMPTS) {
                    console.error('GistScroller: גובה #content לא השתנה לאחר ' + MAX_NO_CHANGE_ATTEMPTS + ' ניסיונות. עוצר.');
                    alert('הגלילה (מ-Gist) הופסקה. גובה #content לא השתנה.');
                    scrollableElement.style.outline = 'none';
                    return;
                }
            } else {
                noChangeCount = 0;
            }
            lastScrollHeightOfContent = heightAfterLoadAttempt;
            
            scrollAndLoad();

        }, delayBetweenScrollsMs);
    }
    
    lastScrollHeightOfContent = getContentScrollHeight();
    scrollAndLoad();
})();