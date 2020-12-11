from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time
import undetected_chromedriver as uc
import ssl
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import Select
ssl._create_default_https_context = ssl._create_unverified_context
driver = uc.Chrome()

#Make sure to clear you the items you added to the cart before trying the bot again


#Input Info Here, Put in your actual address info or else it might not go through, can fake name and phone number
username = 'sanket.manjesh@gmail.com'
password = 'S_manjesh3'
name = 'Mike Hawk'
address = '4808 Vasca Drive'
zipCode = '34240'
city = 'Sarasota'
state = 'Florida'
phoneNumber = '1234567890'

#set ship to True if you want item shipped or False if you want it picked up
ship = False

#Method to check if item is in stock or not
def isInStock(driver):
    try:
        WebDriverWait(driver, 2).until(
            EC.presence_of_element_located(
                (By.XPATH, '//*[@data-test="orderPickupButton"]')))
        return True
    except TimeoutException:
        return False

driver.get('https://www.target.com')

#Login To Account
ps5Link = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.ID, 'account')))
ps5Link.click()

ps5Link = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, '//*[@id="accountNav-signIn"]/a')))
driver.execute_script("arguments[0].click();", ps5Link)


ps5Link = WebDriverWait(driver, 10).until(
EC.presence_of_element_located((By.ID, 'username')))
ps5Link.send_keys(username)

ps5Link = WebDriverWait(driver, 10).until(
EC.presence_of_element_located((By.ID, 'password')))
ps5Link.send_keys(password)

ps5Link = WebDriverWait(driver, 10).until(
EC.presence_of_element_located((By.ID, 'login')))
ps5Link.click()

#Search for Item
search_bar = WebDriverWait(driver, 10).until(
EC.presence_of_element_located((By.ID, 'search')))
search_bar.send_keys('PlayStation 5')
search_bar.send_keys(Keys.RETURN)

driver.refresh()
try:
    #Link for actual item you want to buy
    ps5Link = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, 'PlayStation 5 Console')))
    ps5Link.click()

    #Refresh Until Item is in Stock and Pickup Button is available
    while not isInStock(driver):
        driver.refresh()
    else:
        if ship is False:
            ps5Link = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//*[@data-test="orderPickupButton"]')))
            ps5Link.click()

            #Check if item has coverage option or not
            try:
                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.XPATH, '//*[@data-test="espModalContent-declineCoverageButton"]')))
                ps5Link.click()
            except TimeoutException:
                pass

            ps5Link = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//*[@data-test="addToCartModalViewCartCheckout"]')))
            ps5Link.click()

            ps5Link = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//*[@data-test="checkout-button"]')))
            ps5Link.click()
            try:
                #Check if shipping info has already been entered and saved before
                ps5Link = WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located(
                        (By.XPATH, '//*[@data-test="edit-pickup-button"]')))
            except TimeoutException:
                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.ID, 'pickupPersonName')))
                ps5Link.send_keys(name)

                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.XPATH, '//*[@data-test="save-and-continue-button"]')))
                ps5Link.click()

        else:
            ps5Link = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//*[@data-test="shipItButton"]')))
            ps5Link.click()

            ps5Link = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//*[@data-test="espModalContent-declineCoverageButton"]')))
            ps5Link.click()

            ps5Link = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//*[@data-test="addToCartModalViewCartCheckout"]')))
            ps5Link.click()

            ps5Link = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//*[@data-test="checkout-button"]')))
            ps5Link.click()

            try:
                #Check if shipping info has already been entered and saved before
                ps5Link = WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located(
                        (By.XPATH, '//*[@data-test="edit-shipping-button"]')))
            except TimeoutException:
                #Fill in Purchase Info if not already filled in

                #Put in name, address, contact
                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.NAME, 'full_name')))
                ps5Link.send_keys(name)

                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.ID, 'address_line1')))
                ps5Link.send_keys(address)

                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.ID, 'zip_code')))
                ps5Link.send_keys(zipCode)

                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.ID, 'city')))
                ps5Link.send_keys(city)

                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.ID, 'state')))
                stateSelect = Select(ps5Link)
                stateSelect.select_by_visible_text(state)

                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.ID, 'mobile')))
                ps5Link.send_keys(phoneNumber)

                ps5Link = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.XPATH, '//*[@data-test="saveButton"]')))
                ps5Link.click()


finally:
    time.sleep(5)
    #driver.quit()