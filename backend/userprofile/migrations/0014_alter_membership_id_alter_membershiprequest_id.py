# Generated by Django 4.2.1 on 2023-05-15 06:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0013_auto_20230512_1207'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membership',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='membershiprequest',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
