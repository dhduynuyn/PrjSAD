# from huggingface_hub import InferenceClient

# client = InferenceClient(
#     provider="nebius",
#     api_key="hf_xxxxxxxxxxxxxx",
# )

# # output is a PIL.Image object
# image = client.text_to_image(
#     "Under the brilliant sunset, a girl in a white ao dai stood silently by the riverbank, the gentle wind made the skirt of her dress flutter, behind her was a row of coconut trees leaning over, their shadows reflected on the sparkling water.",
#     model="stabilityai/stable-diffusion-xl-base-1.0",
# )

# image.show()

from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="replicate",
    api_key="hf_xxxxxxxxxxxxxx",
)

# output is a PIL.Image object
image = client.text_to_image(
    "Under the brilliant sunset, a girl in a white ao dai stood silently by the riverbank, the gentle wind made the skirt of her dress flutter, behind her was a row of coconut trees leaning over, their shadows reflected on the sparkling water.",
    model="black-forest-labs/FLUX.1-dev",
)

image.show()