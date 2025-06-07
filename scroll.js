(function() {
    // --- ערכי ברירת מחדל, אם המשתמש לא יזין או יבטל ---
    var defaultTotalProducts = 255;
    var defaultDelayMs = 8000;
    var defaultMaxAttempts = 7;
    var productsPerScroll = 11; // כמה מוצרים נטענים בערך בכל גלילה

    // --- שאל את המשתמש פרמטרים ---
    var userInputProducts = prompt("כמה מוצרים בערך לטעון בסך הכל?", defaultTotalProducts.toString());
    var userInputDelay = prompt("כמה מילישניות המתנה בין גלילות (למשל, 8000 ל-8 שניות)?", defaultDelayMs.toString());
    var userInputAttempts = prompt("כמה ניסיונות כושלים רצופים לפני עצירה?", defaultMaxAttempts.toString());

    // --- המרת הקלט למספרים, וחזרה לברירת מחדל אם הקלט לא תקין או בוטל ---
    var totalProductsToLoad = parseInt(userInputProducts, 10);
    if (isNaN(totalProductsToLoad) || totalProductsToLoad <= 0) {
        totalProductsToLoad = defaultTotalProducts;
        alert("מספר המוצרים לא תקין, משתמש בברירת מחדל: " + defaultTotalProducts);
    }

    var delayBetweenScrollsMs = parseInt(userInputDelay, 10);
    if (isNaN(delayBetweenScrollsMs) || delayBetweenScrollsMs < 1000) { // מינימום שנייה אחת
        delayBetweenScrollsMs = defaultDelayMs;
        alert("זמן ההמתנה לא תקין, משתמש בברירת מחדל: " + defaultDelayMs + "ms");
    }

    var MAX_NO_CHANGE_ATTEMPTS = parseInt(userInputAttempts, 10);
    if (isNaN(MAX_NO_CHANGE_ATTEMPTS) || MAX_NO_CHANGE_ATTEMPTS <= 0) {
        MAX_NO_CHANGE_ATTEMPTS = defaultMaxAttempts;
        alert("מספר הניסיונות לא תקין, משתמש בברירת מחדל: " + defaultMaxAttempts);
    }

    var totalScrollsToPerform = Math.ceil(totalProductsToLoad / productsPerScroll);

    // --- שאר הקוד נשאר כמעט זהה ---
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
    console.log('ScrollerJS: Starting auto-scroll for approx. ' + totalProductsToLoad + ' products.');
    console.log('ScrollerJS: Delay: ' + delayBetweenScrollsMs + 'ms, Max Attempts: ' + MAX_NO_CHANGE_ATTEMPTS + ', Total Scrolls: ' + totalScrollsToPerform);
    alert('מתחיל גלילה אוטומטית לטעינת כ-' + totalProductsToLoad + ' מוצרים.\nהמתנה: ' + (delayBetweenScrollsMs/1000) + ' שניות, ניסיונות מקסימליים: ' + MAX_NO_CHANGE_ATTEMPTS + '.\nלחץ אישור כדי להתחיל.');

    function getContentScrollHeight() {
        return scrollableElement.scrollHeight;
    }

    function performActualScroll() {
        var currentScrollTop = scrollableElement.scrollTop;
        var currentScrollHeight = scrollableElement.scrollHeight;
        var clientHeight = scrollableElement.clientHeight;

        if ((currentScrollHeight - currentScrollTop) <= (clientHeight + 200)) {
            var scrollUpAmount = clientHeight * 0.3;
            console.log('ScrollerJS: Near bottom. "BIG jiggle": up by ' + Math.round(scrollUpAmount) + 'px.');
            scrollableElement.scrollTop = Math.max(0, currentScrollTop - scrollUpAmount);

            setTimeout(function() {
                console.log('ScrollerJS: "BIG Jiggle": scrolling to bottom.');
                scrollableElement.scrollTop = scrollableElement.scrollHeight;
            }, 250);
        } else {
            scrollableElement.scrollTop = scrollableElement.scrollHeight;
        }
    }

    function scrollAndLoad() {
        if (scrollsDone >= totalScrollsToPerform) {
            console.log('ScrollerJS: הסתיימה הגלילה (הגעה למספר גלילות רצוי). נטענו כ-' + (scrollsDone * productsPerScroll) + ' מוצרים.');
            alert('הסתיימה הגלילה! (הגעה למספר גלילות רצוי). נטענו כ-' + (scrollsDone * productsPerScroll) + ' מוצרים.');
            scrollableElement.style.outline = 'none';
            return;
        }

        performActualScroll();
        scrollsDone++;
        console.log('ScrollerJS: גלילה #' + scrollsDone + '/' + totalScrollsToPerform + '. גובה נוכחי לפני טעינה: ' + lastScrollHeightOfContent);
        
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
    }
    
    lastScrollHeightOfContent = getContentScrollHeight();
    scrollAndLoad();
})();
