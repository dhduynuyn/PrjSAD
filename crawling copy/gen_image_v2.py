from together import Together

client = Together(api_key="together_ai_api")
response = client.images.generate(
    prompt="[Under the brilliant sunset, a girl in a white ao dai stood silently by the riverbank, the gentle wind made the skirt of her dress flutter, behind her was a row of coconut trees leaning over, their shadows reflected on the sparkling water.]",
    model="black-forest-labs/FLUX.1-schnell-Free",
    width=1024,
    height=768,
    steps=4,
    n=1,
    response_format="b64_json",
    stop=[],
    _gl="1*1keu036*_gcl_au*MTQ1MDI3ODU1OS4xNzQ2MTE4ODI0*_ga*MTMwODMxMjk3MS4xNzQ2MTE4ODI0*_ga_BS43X21GZ2*MTc0NjExODgyNC4xLjEuMTc0NjExOTE1MS4wLjAuMA..*_ga_BBHKJ5V8S0*MTc0NjExODgyNC4xLjEuMTc0NjExOTE1MS4wLjAuMA.."
)
print(response.data[0].b64_json)

import base64

# Assuming `response.data[0].b64_json` is your base64 string
image_data = response.data[0].b64_json

# Decode and save it as a PNG
with open("output_image.png", "wb") as f:
    f.write(base64.b64decode(image_data))

print("Image saved as output_image.png")
