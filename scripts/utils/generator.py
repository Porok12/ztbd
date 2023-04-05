import random
import csv
import datetime
import time
import os

# define the number of rows to generate x 48
# Generate 0,5 mln rows in 20 sec = 30 MB
num_rows = 10000

output_file = '../webscraping/weather.csv'

file_exists = os.path.exists(output_file)
with open(output_file, 'a', newline='') as file:
    writer = csv.writer(file)
    
    # write the header row if the file is new
    if not file_exists:
        writer.writerow(['Date', 'Time', 'Temperature (F)', 'Dew Point (F)', 'Relative Humidity (%)',
                         'Wind Direction', 'Wind Speed (mph)', 'Wind Gust (mph)', 'Atmospheric Pressure (hPa)',
                         'Precipitation', 'Condition'])
    
    # generate the data for one day
    for i in range(num_rows):
        # generate a random date (10 years peroid)
        date = datetime.datetime.now().date() - datetime.timedelta(days=random.randint(0, 3650))

        # average temp in Poland per month
        if date.strftime("%m") == "01":
            temp = round(random.gauss(28, 6), 1)  # normal distribution
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution
        
        if date.strftime("%m") == "02":
            temp = round(random.gauss(30, 6), 1)  # normal distribution
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution

        if date.strftime("%m") == "03":
            temp = round(random.gauss(35, 6), 1)  # normal distribution
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 

        if date.strftime("%m") == "04":
            temp = round(random.gauss(46, 6), 1)  # normal distribution
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 

        if date.strftime("%m") == "05":
            temp = round(random.gauss(58, 6), 1)  # normal distribution
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 

        if date.strftime("%m") == "06":
            temp = round(random.gauss(69, 6), 1)  # normal distribution
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 

        if date.strftime("%m") == "07":
            temp = round(random.gauss(72, 6), 1)  # normal distribution 
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 

        if date.strftime("%m") == "08":
            temp = round(random.gauss(68, 6), 1)  # normal distribution 
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 

        if date.strftime("%m") == "09":
            temp = round(random.gauss(58, 6), 1)  # normal distribution 
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 

        if date.strftime("%m") == "10":
            temp = round(random.gauss(46, 6), 1)  # normal distribution
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 

        if date.strftime("%m") == "11":
            temp = round(random.gauss(36, 6), 1)  # normal distribution
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 

        if date.strftime("%m") == "12":
            temp = round(random.gauss(29, 6), 1)  # normal distribution
            dew_point = round(random.gauss(temp - 10, 5), 1)  # normal distribution 
        
        

        humidity_global = round(random.randint(35,90), 1)
        wind_direction = random.randint(0, 360)  
        wind_speed = round(random.triangular(0, 12, 3), 1)  # triangular distribution
        wind_gust = round(wind_speed + random.gauss(2, 1), 1)  # normal distribution
        pressure = round(random.gauss(29.71, 0.3), 2)  # normal distribution
        precip = 0.0

        start_time = datetime.datetime(100, 1, 1, 0, 0)   # starting time: 12:00 AM
        end_time = datetime.datetime(100, 1, 1, 23, 30)  # ending time: 11:30 PM
        step = datetime.timedelta(minutes=30)  # step: 30 minutes    

        current_time = start_time

        # Start at night, so it must start with the lowest to average value in Poland
        temp -= 5

        # genarate row with time
        while current_time <= end_time:
            time = current_time.strftime('%I:%M %p') 

            if current_time <= datetime.datetime(100, 1, 1, 6, 0):
                temp = round(temp - random.uniform(-0.5,1.1), 1)
                dew_point = round(temp - random.randint(0,6), 1)
                humidity = round(humidity_global - random.uniform(-10,10), 1)
                wind_direction = random.choice(["WNW", 'NNW', 'NNE', 'ENE', 'ESE', 'SSE', 'SSW', 'WSW'])
                wind_speed = round(random.triangular(0, 12, 3), 1)
                wind_gust = round(wind_speed + random.gauss(2, 1), 1)
                pressure = round(random.gauss(29.71, 0.3), 2)
                if temp < 32:
                    condition = random.choice(['Snowy', 'Cloudy', "Fair", 'Mostly Cloudy'])
                elif temp < 50:
                    condition = random.choice(['Rainy', 'Foggy', 'Mostly Cloudy', "Fair", 'Cloudy'])
                elif temp < 60:
                    condition = random.choice(['Partly Cloudy', 'Mostly Cloudy',"Fair", 'Cloudy', 'Thunder'])
                else:
                    condition = random.choice(['Clear', "Fair"])

                if humidity > 80:
                    condition = "Rain"

            
            if current_time <= datetime.datetime(100, 1, 1, 11, 0):
                temp = round(temp - random.uniform(-1.5,0.3), 1)
                dew_point = round(temp - random.randint(0,6), 1)
                humidity = round(humidity_global - random.uniform(-10,10), 1)
                wind_direction = random.choice(["WNW", 'NNW', 'NNE', 'ENE', 'ESE', 'SSE', 'SSW', 'WSW'])
                wind_speed = round(random.triangular(0, 12, 3), 1)
                wind_gust = round(wind_speed + random.gauss(2, 1), 1)
                pressure = round(random.gauss(29.71, 0.3), 2)
                if temp < 32:
                    condition = random.choice(['Snowy', 'Cloudy', "Fair", 'Mostly Cloudy'])
                elif temp < 50:
                    condition = random.choice(['Rainy', 'Foggy', 'Mostly Cloudy', "Fair", 'Cloudy'])
                elif temp < 60:
                    condition = random.choice(['Partly Cloudy', 'Mostly Cloudy',"Fair", 'Cloudy', 'Thunder'])
                else:
                    condition = random.choice(['Clear', "Fair"])

                if humidity > 80:
                    condition = "Rain"

            if current_time <= datetime.datetime(100, 1, 1, 16, 0):
                temp = round(temp - random.uniform(-1.8,0.3), 1)
                dew_point = round(temp - random.randint(0,6), 1)
                humidity = round(humidity_global - random.uniform(-10,10), 1)
                wind_direction = random.choice(["WNW", 'NNW', 'NNE', 'ENE', 'ESE', 'SSE', 'SSW', 'WSW'])
                wind_speed = round(random.triangular(0, 12, 3), 1)
                wind_gust = round(wind_speed + random.gauss(2, 1), 1)
                pressure = round(random.gauss(29.71, 0.3), 2)
                if temp < 32:
                    condition = random.choice(['Snowy', 'Cloudy', "Fair", 'Mostly Cloudy'])
                elif temp < 50:
                    condition = random.choice(['Rainy', 'Foggy', 'Mostly Cloudy', "Fair", 'Cloudy'])
                elif temp < 60:
                    condition = random.choice(['Partly Cloudy', 'Mostly Cloudy',"Fair", 'Cloudy', 'Thunder'])
                else:
                    condition = random.choice(['Clear', "Fair"])

                if humidity > 80:
                    condition = "Rain"
                
            if current_time <= datetime.datetime(100, 1, 1, 20, 0):
                temp = round(temp - random.uniform(-1,1.3), 1)
                dew_point = round(temp - random.randint(0,6), 1)
                humidity = round(humidity_global - random.uniform(-10,10), 1)
                wind_direction = random.choice(["WNW", 'NNW', 'NNE', 'ENE', 'ESE', 'SSE', 'SSW', 'WSW'])
                wind_speed = round(random.triangular(0, 12, 3), 1)
                wind_gust = round(wind_speed + random.gauss(2, 1), 1)
                pressure = round(random.gauss(29.71, 0.3), 2)
                if temp < 32:
                    condition = random.choice(['Snowy', 'Cloudy', "Fair", 'Mostly Cloudy'])
                elif temp < 50:
                    condition = random.choice(['Rainy', 'Foggy', 'Mostly Cloudy', "Fair", 'Cloudy'])
                elif temp < 60:
                    condition = random.choice(['Partly Cloudy', 'Mostly Cloudy',"Fair", 'Cloudy', 'Thunder'])
                else:
                    condition = random.choice(['Clear', "Fair"])

                if humidity > 80:
                    condition = "Rain"

            if current_time <= datetime.datetime(100, 1, 1, 23, 30):
                temp = round(temp - random.uniform(-0.3,1.5), 1)
                dew_point = round(temp - random.randint(0,6), 1)
                humidity = round(humidity_global - random.uniform(-10,10), 1)
                wind_direction = random.choice(["WNW", 'NNW', 'NNE', 'ENE', 'ESE', 'SSE', 'SSW', 'WSW'])
                wind_speed = round(random.triangular(0, 12, 3), 1)
                wind_gust = round(wind_speed + random.gauss(2, 1), 1)
                pressure = round(random.gauss(29.71, 0.3), 2)
                if temp < 32:
                    condition = random.choice(['Snowy', 'Cloudy', "Fair", 'Mostly Cloudy'])
                elif temp < 50:
                    condition = random.choice(['Rainy', 'Foggy', 'Mostly Cloudy', "Fair", 'Cloudy'])
                elif temp < 60:
                    condition = random.choice(['Partly Cloudy', 'Mostly Cloudy',"Fair", 'Cloudy', 'Thunder'])
                else:
                    condition = random.choice(['Clear', "Fair"])

                if humidity > 80:
                    condition = "Rain"

            
            # write the row to the CSV
            writer.writerow([date, time, temp, dew_point, humidity, wind_direction, wind_speed, wind_gust, pressure, precip, condition])
            current_time = current_time + step
        
        # print a status message every 48,000 rows
        if i % 1000 == 0:
            print(f'{i * 48} rows generated')
        
print('Done generating data')