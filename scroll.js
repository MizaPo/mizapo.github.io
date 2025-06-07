(function() {
    // --- התאם את הפרמטרים האלה לפי הצורך ---
    var totalScrollsToPerform = Math.ceil(250 / 11); // מטרה: 1000 מוצרים
    var delayBetweenScrollsMs = 8000;                 // 8 שניות המתנה בין ניסיונות גלילה
    var MAX_NO_CHANGE_ATTEMPTS = 7;                   // 7 ניסיונות כושלים לפני עצירה
    // ------------------------------------------

    var scrollsDone = 0;
    var noChangeCount = 0;
    var lastScrollHeightOfContent = 0;
    var scrollableElement = document.querySelector('#content');

    if (!scrollableElement) {
        console.error('ScrollerJS: Scrollable element "#content" not found!');
        alert('שגיאה מהסקריפט הנטען: אלמנט הגלילה "#content" לא נמצא בדף.');
        return;
    }

    scrollableElement.style.outline = '3px dashed blue';
    console.log('ScrollerJS: Attempting to start auto-scroll on #content...');
    alert('מתחיל גלילה אוטומטית על #content.\nלחץ אישור כדי להתחיל.');

    function getContentScrollHeight() {
        return scrollableElement.scrollHeight;
    }

    // --- זו הפונקציה שצריך לשנות ---
    function performActualScroll() {
        var currentScrollTop = scrollableElement.scrollTop;
        var currentScrollHeight = scrollableElement.scrollHeight;
        var clientHeight = scrollableElement.clientHeight;

        // בדוק אם אנחנו קרובים לתחתית
        // clientHeight הוא גובה החלק הנראה של האלמנט
        // currentScrollHeight - currentScrollTop הוא הגובה שנותר לגלול
        // אם הגובה שנותר לגלול קטן או שווה לגובה הנראה + מרווח קטן (למשל 100px), אנחנו קרובים לסוף
        if ((currentScrollHeight - currentScrollTop) <= (clientHeight + 100)) { 
            console.log('ScrollerJS: Near bottom. Attempting to "jiggle" scroll: scrolling up slightly.');
            scrollableElement.scrollTop = Math.max(0, currentScrollTop - 50); // גלול 50 פיקסלים למעלה

            setTimeout(function() {
                console.log('ScrollerJS: "Jiggle" scroll: scrolling to bottom.');
                scrollableElement.scrollTop = scrollableElement.scrollHeight;
            }, 150); // אפשר לשחק עם ההמתנה הזו, אולי 150ms או 200ms
        } else {
            scrollableElement.scrollTop = scrollableElement.scrollHeight;
        }
    }
    // --- סוף הפונקציה ששונתה ---

    function scrollAndLoad() {
        if (scrollsDone >= totalScrollsToPerform) {
            console.log('ScrollerJS: הסתיימה הגלילה (הגעה למספר גלילות רצוי). נטענו כ-' + (scrollsDone * 11) + ' מוצרים.');
            alert('הסתיימה הגלילה! (הגעה למספר גלילות רצוי). נטענו כ-' + (scrollsDone * 11) + ' מוצרים.');
            scrollableElement.style.outline = 'none';
            return;
        }

        // --- כאן לא משנים כלום ---
        // קריאה לפונקציה ששונתה
        performActualScroll(); 
        scrollsDone++;
        console.log('ScrollerJS: גלילה #' + scrollsDone + '/' + totalScrollsToPerform + ' על #content. גובה נוכחי לפני טעינה: ' + lastScrollHeightOfContent);
        
        setTimeout(function() {
            var heightAfterLoadAttempt = getContentScrollHeight();
            console.log('ScrollerJS: גובה #content לאחר ניסיון טעינה: ' + heightAfterLoadAttempt);

            if (scrollsDone > 0 && heightAfterLoadAttempt <= lastScrollHeightOfContent) {
                noChangeCount++;
                console.warn('ScrollerJS: גובה #content לא השתנה. ניסיון ' + noChangeCount + '/' + MAX_NO_CHANGE_ATTEMPTS);
                if (noChangeCount >= MAX_NO_CHANGE_ATTEMPTS) {
                    console.error('ScrollerJS: גובה #content לא השתנה לאחר ' + MAX_NO_CHANGE_ATTEMPTS + ' ניסיונות. עוצר.');
                    alert('הגלילה הופסקה. גובה #content לא השתנה לאחר מספר ניסיונות.');
                    scrollableElement.style.outline = 'none';
                    return;
                }
            } else {
                noChangeCount = 0;
            }
            lastScrollHeightOfContent = heightAfterLoadAttempt;
            
            scrollAndLoad();
        }, delayBetweenScrollsMs);
        // --- סוף החלק שלא משנים ---
    }
    
    lastScrollHeightOfContent = getContentScrollHeight();
    scrollAndLoad();
})();
