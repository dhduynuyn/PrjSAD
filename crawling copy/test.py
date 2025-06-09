from IPython.display import display, Image
import base64

# Giả sử bạn đã có profile_image là binary (bytes)
# Kiểm tra một đoạn đầu
print(profile_image[:20])

# Encode base64 và hiển thị trực tiếp
encoded = base64.b64encode(profile_image).decode('utf-8')
display(Image(data=base64.b64decode(encoded)))
