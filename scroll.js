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
        var clientHeight = scrollableElement.clientHeight; // הגובה הנראה של האלמנט

        // בדוק אם אנחנו קרובים לתחתית
        if ((currentScrollHeight - currentScrollTop) <= (clientHeight + 200)) { // הגדלתי את המרווח ל-200px
            var scrollUpAmount = clientHeight * 0.3; // גלול למעלה 30% מגובה החלק הנראה
            console.log('ScrollerJS: Near bottom. Attempting "BIG jiggle" scroll: scrolling up by ' + Math.round(scrollUpAmount) + 'px.');
            scrollableElement.scrollTop = Math.max(0, currentScrollTop - scrollUpAmount);

            setTimeout(function() {
                console.log('ScrollerJS: "BIG Jiggle" scroll: scrolling to bottom.');
                scrollableElement.scrollTop = scrollableElement.scrollHeight;
            }, 250); // הגדלתי קצת את ההמתנה ל-250ms
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
