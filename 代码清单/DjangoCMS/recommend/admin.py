from django.contrib import admin
from recommend.models import Hotel,Food,View
from django.utils.safestring import mark_safe
# Register your models here.
class HotelAdmin(admin.ModelAdmin):
    list_display = ("hotel_id","hotel_name","hotel_score","hotel_address","hotel_kind","upload_img")
    list_filter = ('hotel_kind',)
    search_fields = ('hotel_name',)
    def upload_img(self, obj):
        return mark_safe('<img src="%s" width="50px" />' % (obj.hotel_img.url,))

    upload_img.short_description = '缩略图'
    upload_img.allow_tags = True

class FoodAdmin(admin.ModelAdmin):

    list_display = ("food_id","food_name","food_score","food_address","food_kind","upload_img")
    list_filter = ('food_kind',)
    search_fields = ('food_name',)
    def upload_img(self, obj):
        return mark_safe('<img src="%s" width="50px" />' % (obj.food_img.url,))

    upload_img.short_description = '缩略图'
    upload_img.allow_tags = True

class ViewAdmin(admin.ModelAdmin):

    list_display = ("view_id","view_name","view_score","view_address","upload_img")
    search_fields = ('view_name',)
    def upload_img(self, obj):
        return mark_safe('<img src="%s" width="50px" />' % (obj.view_img.url,))

    upload_img.short_description = '缩略图'
    upload_img.allow_tags = True

admin.site.register(Hotel, HotelAdmin)
admin.site.register(Food,FoodAdmin)
admin.site.register(View, ViewAdmin)