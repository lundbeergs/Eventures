# Generated by Django 3.1.2 on 2023-05-12 12:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0012_auto_20230512_1107'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='tickets_left',
            field=models.PositiveIntegerField(default=10000),
        ),
    ]
