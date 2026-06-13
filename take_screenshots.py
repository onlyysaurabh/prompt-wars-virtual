import time
from playwright.sync_api import sync_playwright

def take_screenshots():
    with sync_playwright() as p:
        # Launch browser headless
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        
        # Go to Homepage
        page.goto('http://localhost:3000/')
        page.wait_for_load_state('networkidle')
        # Wait a bit more for animations to settle
        time.sleep(2)
        page.screenshot(path='/home/skylap/prompt-wars-virtual/public/screenshot-homepage.png', full_page=False)

        # Go to Signup page
        page.goto('http://localhost:3000/signup')
        page.wait_for_load_state('networkidle')
        time.sleep(2)
        page.screenshot(path='/home/skylap/prompt-wars-virtual/public/screenshot-signup.png', full_page=False)
        
        browser.close()

if __name__ == "__main__":
    take_screenshots()
