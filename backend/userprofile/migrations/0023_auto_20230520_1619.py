# Generated by Django 3.1.2 on 2023-05-20 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0022_alter_event_event_pic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membership',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='membershiprequest',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]