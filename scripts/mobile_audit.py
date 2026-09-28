from pathlib import Path
from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:4173"
ROUTES = {
    "home": "/",
    "tawjih": "/tawjih",
    "orientation_form": "/tawjih/inscription",
    "about": "/about",
    "contact": "/contact",
    "student": "/student-area",
    "coaching": "/coaching-offer",
    "coaching_form": "/coaching-offer/inscription",
    "schools": "/higher-schools",
    "privacy": "/privacy-policy",
    "admin_login": "/login",
    "bac": "/bac-simulator",
}


def main() -> None:
    output = Path("mobile-audit")
    output.mkdir(exist_ok=True)
    failures = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)

        for name, route in ROUTES.items():
            page.goto(BASE_URL + route, wait_until="networkidle")
            page.evaluate(
                """
                async () => {
                  const step = Math.max(500, window.innerHeight * 0.75);
                  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
                    window.scrollTo(0, y);
                    await new Promise(resolve => setTimeout(resolve, 35));
                  }
                  window.scrollTo(0, 0);
                }
                """
            )
            page.wait_for_timeout(150)

            report = page.evaluate(
                """
                () => {
                  const root = document.documentElement;
                  const viewport = root.clientWidth;
                  const offenders = [...document.querySelectorAll('body *')]
                    .filter(el => {
                      const rect = el.getBoundingClientRect();
                      if (rect.width < 1 || rect.height < 1) return false;
                      const style = getComputedStyle(el);
                      const intentionalScroller = ['auto', 'scroll'].includes(style.overflowX);
                      return !intentionalScroller && (rect.left < -1 || rect.right > viewport + 1);
                    })
                    .slice(0, 8)
                    .map(el => {
                      const rect = el.getBoundingClientRect();
                      return {
                        tag: el.tagName.toLowerCase(),
                        id: el.id || '',
                        className: typeof el.className === 'string' ? el.className.slice(0, 140) : '',
                        left: Math.round(rect.left),
                        right: Math.round(rect.right),
                        width: Math.round(rect.width),
                      };
                    });
                  return {
                    viewport,
                    scrollWidth: root.scrollWidth,
                    overflow: root.scrollWidth > viewport + 1,
                    offenders,
                  };
                }
                """
            )
            print(f"{name}: viewport={report['viewport']} scrollWidth={report['scrollWidth']} overflow={report['overflow']}")
            for offender in report["offenders"]:
                print(f"  {offender}")
            if report["overflow"]:
                failures.append(name)

        browser.close()

    if failures:
        raise SystemExit("Routes with horizontal page overflow: " + ", ".join(failures))


if __name__ == "__main__":
    main()
