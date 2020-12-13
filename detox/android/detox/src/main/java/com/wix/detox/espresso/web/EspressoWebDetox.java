package com.wix.detox.espresso.web;

import android.util.Log;
import android.view.View;

import androidx.test.espresso.web.model.Atom;
import androidx.test.espresso.web.model.Atoms;
import androidx.test.espresso.web.model.ElementReference;
import androidx.test.espresso.web.model.Evaluation;
import androidx.test.espresso.web.model.SimpleAtom;
import androidx.test.espresso.web.sugar.Web.WebInteraction;
import androidx.test.espresso.web.webdriver.DriverAtoms;

import org.hamcrest.Matcher;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Nullable;

import static androidx.test.espresso.web.assertion.WebViewAssertions.webMatches;
import static androidx.test.espresso.web.sugar.Web.onWebView;
import static androidx.test.espresso.web.webdriver.DriverAtoms.getText;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.not;

public class EspressoWebDetox {

    private static final String TAG = "EspressoWebDetox";

    private EspressoWebDetox() {
        // static class
    }

//getWebView.element(matcher)
    public static final class WebViewElement {

        private final WebInteraction<Void> webViewInteraction;

        WebViewElement(@Nullable Matcher<View> matcher) {
            this.webViewInteraction = matcher != null ? onWebView(matcher) : onWebView();
        }

        public WebElement element(Atom<List<ElementReference>> matcher) {
            return element(matcher, 0);
        }

        public WebElement element(Atom<List<ElementReference>> matcher, int index) {
            return new WebElement(webViewInteraction, matcher, index);
        }
    }

    public static final class WebElement {
        private final WebInteraction<Void> webViewInteraction;
        private final Atom<List<ElementReference>> matcherAtom;
        private final int index;

        WebElement(WebInteraction<Void> webViewInteraction, Atom<List<ElementReference>> matcherAtom, int index) {
            this.webViewInteraction = webViewInteraction;
            this.matcherAtom = matcherAtom;
            this.index = index;
        }

        public ElementReference get() {
            List<ElementReference> elements = webViewInteraction.perform(matcherAtom).get();

            String sc = matcherAtom.getScript();
            Log.i(TAG, "matcher script: \n" + sc);

            if (elements == null || elements.size() == 0 || index >= elements.size()) {
                throw new RuntimeException("element not found ");
            }

            return elements.get(index);
        }

        public void tap() {
            webViewInteraction.withElement(get()).perform(DriverAtoms.webClick());
        }

        public boolean scrollToView() {
            return webViewInteraction.withElement(get()).perform(DriverAtoms.webScrollIntoView()).get();
        }

        public String getText() {
            return webViewInteraction.withElement(get()).perform(DriverAtoms.getText()).get();
        }

        public Evaluation runScript(String script) {
            return webViewInteraction.withElement(get()).perform(new SimpleAtom(script)).get();
        }

        public Evaluation runScriptWithArgs(String script, final ArrayList<Object> args) {
            return webViewInteraction.withElement(get()).perform(Atoms.scriptWithArgs(script, args)).get();
        }

        public String getCurrentUrl() {
            return webViewInteraction.withElement(get()).perform(Atoms.getCurrentUrl()).get();
        }

        public String getTitle() {
            return webViewInteraction.withElement(get()).perform(Atoms.getTitle()).get();
        }

    }

    public static final class ExpectElement {
        private final WebElement webElement;

        ExpectElement(WebElement webElement) {
            this.webElement = webElement;
        }

        private WebInteraction<Void> webViewInteraction() {
            return webElement.webViewInteraction;
        }

        public void toNotExists() {
            webViewInteraction().check(webMatches(webElement.matcherAtom, equalTo(Collections.<ElementReference>emptyList())));
        }

        public void toExists() {
            webViewInteraction().check(webMatches(webElement.matcherAtom, not(equalTo(Collections.<ElementReference>emptyList()))));
        }

        public void toHaveText(String text) {
            webViewInteraction().withElement(webElement.get()).check(webMatches(getText(), containsString(text)));
        }
    }

    public static WebViewElement getWebView() {
        return getWebView(null);
    }

    public static WebViewElement getWebView(@Nullable Matcher<View> matcher) {
        return new WebViewElement(matcher);
    }

    public static ExpectElement expect(WebElement webElement) {
        return new ExpectElement(webElement);
    }

}